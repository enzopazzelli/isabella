# Plan de acción — Integración de pagos (Mercado Pago + tarjetas)

Documento guía para incorporar cobros online a **Isabella Añatuya Boutique**. Hoy el checkout del carrito termina en WhatsApp ([components/landing/CarritoPanel.jsx](components/landing/CarritoPanel.jsx)); este plan explica qué se necesita para aceptar **tarjeta de crédito, débito, dinero en cuenta de Mercado Pago, efectivo (Pago Fácil / Rapipago) y transferencia** sin reescribir medio sitio.

---

## TL;DR — recomendación

**Usar Mercado Pago → Checkout Pro.**

Es la única vía razonable para este proyecto porque:

- No requiere certificación PCI (MP hostea el formulario de tarjeta, no tocamos datos sensibles).
- Se implementa con **una sola API route** en Next.js (crear `preference`) + un webhook de notificaciones.
- Acepta **tarjeta de crédito, débito, dinero en MP, Rapipago, Pago Fácil y transferencia** sin código adicional.
- Soporta **cuotas sin interés** si el dueño negocia promociones con MP.
- Funciona en Argentina con CUIT/CUIL personal o de monotributo — no hace falta ser S.A.
- Compatible con el deploy actual en Vercel sin cambios de infraestructura.

Alternativa descartada: **Checkout API / Bricks** (tarjeta tokenizada en el propio sitio). Da mejor UX pero exige manejo de PCI-DSS SAQ-A, validación antifraude propia y más trabajo de backend. No vale la pena para el volumen esperado de una boutique.

> Otras pasarelas (Stripe, MODO, Ualá Bis, Getnet, Payway) quedan fuera del plan: Stripe no opera cobros locales en ARS, y el resto duplica el esfuerzo sin aportar nada que MP no haga ya.

---

## Parte 1 — Qué tiene que hacer el dueño (off-code)

Estos pasos los hace el cliente, no el desarrollador. Sin esto, no hay nada para integrar.

### 1.1. Cuenta de Mercado Pago verificada

- Crear cuenta en [mercadopago.com.ar](https://www.mercadopago.com.ar) con el CUIT/CUIL del titular del negocio.
- Completar el **perfil de vendedor**: razón social (o nombre del monotributista), rubro (indumentaria / moda), dirección comercial.
- Verificar identidad (DNI + selfie) — MP lo pide antes de habilitar cobros reales.
- Asociar una **cuenta bancaria o CBU** para los retiros (si no, la plata queda dentro de MP).

### 1.2. Condiciones fiscales

- Estar inscripto como **monotributista o responsable inscripto**. MP retiene IVA e Ingresos Brutos automáticamente según el régimen.
- Tener claro si se va a facturar electrónicamente. MP **no emite factura**: solo cobra. La facturación sigue siendo responsabilidad del negocio (AFIP / AGIP / etc).
- Definir si el precio publicado **incluye o no el costo de MP**. La comisión estándar hoy es del orden de **~4-6% + IVA** por operación con acreditación inmediata, más barata si se acepta acreditación a 14 días. Verificar números actualizados en el panel de MP antes de fijar precios.

### 1.3. Credenciales de API

Desde el panel de MP → **Tu negocio → Configuración → Gestión y administración → Credenciales**:

- **Public Key** (test y producción)
- **Access Token** (test y producción)

Guardarlas en un gestor de contraseñas. El **Access Token de producción nunca** debe viajar al frontend ni quedar committeado en el repo.

### 1.4. Política comercial del checkout

Decisiones que el dueño tiene que tomar antes de codear:

- ¿**Cuotas sin interés**? (se negocia con MP o con el banco; por default MP ofrece hasta 12 cuotas con interés).
- ¿**Costo de envío**? (fijo, por zona, gratis arriba de X, o combinar con retiro en local). Esto tiene que sumarse al total que se envía a MP.
- ¿**Stock se descuenta antes o después de que MP confirme el pago?** Recomendado: reservar al iniciar el pago, confirmar al recibir webhook `approved`, liberar si expira.
- ¿Qué pasa si el pago **queda pendiente** (efectivo, Rapipago)? El pedido arranca en estado `pending` y se confirma cuando llega el webhook.
- ¿Política de **devoluciones / cambios**? Tiene que estar publicada antes de cobrar online (requisito de Defensa del Consumidor).
- **Términos y condiciones + Política de privacidad** publicados en el sitio. Sin esto, legalmente no se puede cobrar.

---

## Parte 2 — Qué hay que hacer en el código

El proyecto actual ya tiene todo lo necesario para sumar pagos sin romper lo existente: Next.js 14 App Router con API routes, modelo de pedidos en [lib/orders.js](lib/orders.js), carrito en [components/landing/CarritoPanel.jsx](components/landing/CarritoPanel.jsx).

### 2.1. Dependencias nuevas

```bash
npm install mercadopago
```

El SDK oficial (`mercadopago` v2) es el único paquete obligatorio. No hace falta nada más.

### 2.2. Variables de entorno

Crear `.env.local` (y agregar las mismas variables en **Vercel → Project → Settings → Environment Variables**):

```env
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://isabella-boutique.com.ar
MP_WEBHOOK_SECRET=un-string-random-largo
```

- `MP_ACCESS_TOKEN` → **solo server-side**, jamás prefijar con `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_MP_PUBLIC_KEY` → se puede exponer, pero en Checkout Pro casi no se usa (queda opcional para trackeo).
- `MP_WEBHOOK_SECRET` → se valida la firma que MP manda en el header `x-signature` del webhook.
- Agregar `.env.local` al `.gitignore` (ya debería estar).

### 2.3. Archivos a crear

```
app/api/mercadopago/
├── preference/route.js    → crea la preferencia de pago
└── webhook/route.js       → recibe notificaciones de MP

app/checkout/
├── success/page.jsx       → vuelve acá si el pago se aprueba
├── pending/page.jsx       → vuelve acá si queda pendiente (efectivo)
└── failure/page.jsx       → vuelve acá si falla

lib/
└── mercadopago.js         → cliente del SDK inicializado una vez
```

### 2.4. Archivos a modificar

- [components/landing/CarritoPanel.jsx](components/landing/CarritoPanel.jsx) — sumar un segundo botón **"Pagar online"** al lado del actual "Enviar por WhatsApp". Que el dueño elija cuál ofrecer (o los dos en paralelo durante la transición).
- [lib/orders.js](lib/orders.js) — agregar campo `estado` al pedido (`pending | approved | rejected | refunded`) y `paymentId` devuelto por MP.
- [components/admin/PedidosManager.jsx](components/admin/PedidosManager.jsx) — mostrar el estado y el ID de pago de MP en la tabla.
- [lib/config.js](lib/config.js) — flag `pagosOnlineActivos: true/false` para poder apagar el botón sin redeployar.

### 2.5. Flujo técnico (Checkout Pro)

```
Cliente → clickea "Pagar online" en el carrito
   ↓
Frontend → POST /api/mercadopago/preference con los items del carrito
   ↓
Backend  → SDK MP: preference.create({ items, back_urls, notification_url, external_reference: orderId })
   ↓
Backend  → guarda el pedido en estado "pending" (localStorage + opcionalmente Sheets/webhook)
   ↓
Backend  → responde con { init_point, preferenceId }
   ↓
Frontend → redirect a init_point (página hospedada por MP)
   ↓
Cliente → paga en MP con tarjeta / dinero en cuenta / efectivo
   ↓
MP → redirect del cliente a /checkout/success|pending|failure
   ↓
MP → POST a /api/mercadopago/webhook (asíncrono, fuente de verdad)
   ↓
Backend → valida firma, consulta /v1/payments/{id}, actualiza estado del pedido
```

**Regla de oro:** nunca confiar en el `back_url` para marcar el pedido como pagado. El back_url es solo para la UX del cliente. La confirmación real **siempre viene por webhook**, porque es el único canal que MP garantiza que se entrega aunque el cliente cierre el navegador.

### 2.6. Esqueleto de `app/api/mercadopago/preference/route.js`

```js
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

export async function POST(req) {
  const { items, orderId, cliente } = await req.json()

  const preference = await new Preference(mp).create({
    body: {
      items: items.map(i => ({
        id: String(i.id),
        title: i.nombre,
        quantity: i.cantidad,
        unit_price: Number(i.precio),
        currency_id: 'ARS',
      })),
      external_reference: orderId,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/pending?order=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure?order=${orderId}`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
      statement_descriptor: 'ISABELLA BOUTIQUE',
      metadata: { cliente },
    },
  })

  return NextResponse.json({
    preferenceId: preference.id,
    init_point: preference.init_point,
  })
}
```

### 2.7. Esqueleto de `app/api/mercadopago/webhook/route.js`

```js
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

export async function POST(req) {
  const body = await req.json()
  const signature = req.headers.get('x-signature')

  // TODO: validar firma con MP_WEBHOOK_SECRET (ver docs MP "Validación de origen")

  if (body.type !== 'payment') return NextResponse.json({ ok: true })

  const paymentId = body.data.id
  const payment = await new Payment(mp).get({ id: paymentId })

  const orderId = payment.external_reference
  const status = payment.status // approved | pending | rejected | refunded

  // TODO: actualizar el pedido en la fuente de persistencia elegida
  // (Sheets / webhook a Apps Script / base de datos real — ver 3.1)

  return NextResponse.json({ ok: true })
}
```

### 2.8. Entorno de test antes de producción

MP tiene **sandbox completo** con tarjetas y usuarios de prueba. Pasos:

1. En el panel MP → **Developers → Credenciales → modo TEST** → copiar Access Token de test.
2. Crear **usuarios de prueba** (comprador + vendedor) desde el panel de Developers.
3. Usar **tarjetas de prueba** documentadas en MP (Mastercard 5031 7557 3453 0604, CVV 123, cualquier vencimiento futuro, DNI `12345678`).
4. Probar los tres caminos:
   - Pago aprobado → webhook `approved` → pedido confirmado.
   - Pago rechazado → back_url failure → pedido queda cancelado.
   - Pago en efectivo → back_url pending → webhook llega al acreditarse (o nunca si expira).
5. Solo cuando los tres flujos anden en test, cambiar las credenciales por las de producción.

---

## Parte 3 — Pre-requisitos que vienen del README

Dos puntos del README (sección "Cosas que faltan configurar") **bloquean** esta integración y hay que resolverlos antes o en paralelo:

### 3.1. Persistencia real de pedidos (README #6)

> Hoy los pedidos viven en el `localStorage` del navegador del cliente que compra.

Con WhatsApp daba igual porque el dueño veía el mensaje. Con Mercado Pago **no sirve**: el webhook llega al server de Vercel, no al navegador del cliente, así que necesitamos un lugar server-side donde guardar el pedido.

Opciones, ordenadas por esfuerzo:

- **Mínima viable:** Google Apps Script publicado como webhook, que escribe los pedidos en una pestaña `Pedidos` del Sheet que ya usa el proyecto. El webhook de MP dispara una llamada al Apps Script. Gratis, sin infra, consistente con el stack actual.
- **Media:** Vercel KV (Redis) o Vercel Postgres. Oficial, integrado, free tier razonable para el volumen de una boutique.
- **Completa:** Supabase. Da también auth para el admin y dashboard real. Recomendado si el cliente además pide login multi-usuario.

La elección impacta solo en el webhook: el resto del flujo es igual.

### 3.2. Admin server-side (README #2 y #5)

> El password admin está hardcodeado en un archivo cliente y la persistencia del admin es localStorage.

Para marcar pedidos como "enviado / entregado" con confianza, y sobre todo para que el dueño vea los pedidos pagados desde cualquier dispositivo, el admin necesita un mínimo de backend:

- Mover `adminPassword` a variable de entorno + API route `/api/admin/login` que devuelva un JWT o cookie de sesión.
- Hacer que `PedidosManager` lea los pedidos desde la misma fuente donde los escribe el webhook (Sheets / KV / Supabase).

Se puede hacer en una segunda fase, pero sin esto el dueño solo va a ver los pedidos pagados en el mismo navegador donde los hayan gestionado, cosa que no tiene sentido con pagos reales.

---

## Parte 4 — Orden de implementación sugerido

Estimaciones asumiendo un dev trabajando con el proyecto ya corriendo local.

| # | Tarea | Depende de | Estimación |
|---|---|---|---|
| 1 | Dueño crea cuenta MP, verifica, obtiene credenciales de test y prod | — | 1-3 días (trámite) |
| 2 | Dueño redacta T&C, política de devoluciones y privacidad | — | 1 día |
| 3 | Mover persistencia de pedidos a server-side (Apps Script + Sheet o Vercel KV) | README #6 | 0.5-1 día |
| 4 | Admin con auth server-side mínimo | README #2, #5 | 0.5-1 día |
| 5 | API route `preference` + botón "Pagar online" en el carrito | 1, 3 | 0.5 día |
| 6 | Páginas `/checkout/success|pending|failure` | 5 | 0.25 día |
| 7 | API route `webhook` + actualización de estado de pedido | 3, 5 | 0.5 día |
| 8 | Validación de firma del webhook + manejo de idempotencia | 7 | 0.25 día |
| 9 | Pruebas end-to-end en sandbox (tarjetas de test, efectivo, rechazo) | 5-8 | 0.5 día |
| 10 | Swap de credenciales test → prod y primer cobro real de prueba | 9 | 0.25 día |
| 11 | Monitoreo: logs de webhook en Vercel + alerta si falla | 10 | 0.25 día |

**Total de desarrollo:** ~4-5 días hábiles si los trámites del dueño ya están hechos. El grueso del tiempo real se va a ir en esperar la verificación de la cuenta MP y en afinar la persistencia de pedidos.

---

## Parte 5 — Lo que hay que cuidar

Cosas que son fáciles de olvidar y salen caras en producción:

- **Idempotencia del webhook.** MP puede reenviar el mismo evento varias veces. Guardar `paymentId` como clave única y saltar si ya fue procesado.
- **Validación de firma.** Sin validar el header `x-signature`, cualquiera puede postear al webhook y marcar pedidos como pagados. MP documenta el esquema de HMAC-SHA256.
- **No confiar en el total que manda el frontend.** Recalcular el total en el backend leyendo precios desde la fuente de verdad (Sheets / KV). Si no, un cliente puede editar el fetch y pagar $1 por cualquier producto.
- **Reserva de stock.** Si el producto queda `stock: 0` solo cuando el pago se aprueba, se puede vender lo mismo dos veces mientras un cliente está pagando. Reservar al crear la preferencia y liberar si el pago no llega en X minutos.
- **Moneda.** Fijar `currency_id: 'ARS'` explícito. MP tiene cuentas multi-moneda y mezclar es sinónimo de dolor.
- **Redondeo.** `unit_price` acepta decimales pero el total tiene que cerrar exacto con la suma de los ítems, si no MP rechaza la preferencia.
- **Costo de envío como ítem aparte.** Agregar el envío como un `item` más (con `id: 'envio'`) en la preferencia, para que MP lo muestre desglosado y el cliente lo vea claro.
- **Pedidos pendientes que nunca se pagan.** Los pagos en efectivo pueden quedar pendientes hasta 3 días. Definir política de expiración (ej: cancelar a las 72hs) y comunicarla al cliente.
- **Feature flag.** Arrancar con `pagosOnlineActivos: false` en producción y activar solo cuando el primer pago real de prueba haya funcionado.

---

## Parte 6 — Resumen de checklist

Para que quede claro qué depende de quién:

**El dueño (cliente) tiene que:**
- [ ] Crear cuenta MP y verificarla
- [ ] Asociar CBU para retiros
- [ ] Definir política de envíos, devoluciones y cuotas
- [ ] Redactar T&C y política de privacidad
- [ ] Entregar Access Token + Public Key (test y prod)
- [ ] Dar OK al primer cobro real de prueba

**El desarrollador tiene que:**
- [ ] Resolver persistencia server-side de pedidos (pre-requisito)
- [ ] Mover auth del admin a server-side (pre-requisito)
- [ ] Crear `lib/mercadopago.js`, `app/api/mercadopago/preference/route.js`, `app/api/mercadopago/webhook/route.js`
- [ ] Crear páginas `/checkout/success|pending|failure`
- [ ] Agregar botón "Pagar online" al carrito detrás del flag `pagosOnlineActivos`
- [ ] Validación de firma del webhook + idempotencia
- [ ] Recálculo de precios server-side (seguridad)
- [ ] Pruebas en sandbox con los tres flujos
- [ ] Swap a credenciales de producción en Vercel
- [ ] Primer cobro real de prueba y verificación de webhook
