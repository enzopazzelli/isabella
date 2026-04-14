export const defaultHeroSlides = [
  {
    id: '1',
    imagen: '/imgs/IMG_9970.PNG',
    titulo: 'NUEVA TEMPORADA',
    subtitulo: 'A.W. 2026 — Descubri la nueva coleccion',
    textoBoton: 'VER COLECCION',
    linkBoton: '#productos',
    posicionTexto: 'center',
  },
  {
    id: '2',
    imagen: '/imgs/IMG_9969.PNG',
    titulo: 'INVIERNO 2026',
    subtitulo: 'Elegancia y calidez en cada prenda',
    textoBoton: 'EXPLORAR',
    linkBoton: '#nueva-coleccion',
    posicionTexto: 'center',
  },
  {
    id: '3',
    imagen: '/imgs/IMG_9968.PNG',
    titulo: 'ESTILO UNICO',
    subtitulo: 'Prendas seleccionadas para vos',
    textoBoton: 'VER MAS',
    linkBoton: '#productos',
    posicionTexto: 'center',
  },
]

export const defaultCategorias = [
  'Abrigos', 'Denim', 'Vestidos', 'Remeras', 'Pantalones', 'Accesorios',
]

export const defaultCategoryBlocks = [
  { id: '1', nombre: 'ABRIGOS', imagen: '/imgs/IMG_9974.PNG', orden: 1 },
  { id: '2', nombre: 'DENIM', imagen: '/imgs/IMG_9975.PNG', orden: 2 },
  { id: '3', nombre: 'VESTIDOS', imagen: '/imgs/IMG_9971.PNG', orden: 3 },
  { id: '4', nombre: 'REMERAS', imagen: '/imgs/IMG_9972.PNG', orden: 4 },
  { id: '5', nombre: 'PANTALONES', imagen: '/imgs/IMG_9976.PNG', orden: 5 },
  { id: '6', nombre: 'ACCESORIOS', imagen: '/imgs/IMG_9977.PNG', orden: 6 },
]

export const defaultMarcas = [
  { id: '1', nombre: 'MILANO', logo: '', orden: 1 },
  { id: '2', nombre: 'SELENA DENIM', logo: '', orden: 2 },
  { id: '3', nombre: 'TOSCANA', logo: '', orden: 3 },
  { id: '4', nombre: 'OSLO KNITS', logo: '', orden: 4 },
  { id: '5', nombre: 'ROMA STUDIO', logo: '', orden: 5 },
  { id: '6', nombre: 'FIRENZE', logo: '', orden: 6 },
  { id: '7', nombre: 'CAPRI SILK', logo: '', orden: 7 },
  { id: '8', nombre: 'VIENA ATELIER', logo: '', orden: 8 },
]

export const defaultProductos = [
  {
    id: '1', nombre: 'Blazer Milano', categoria: 'Abrigos', marca: 'MILANO',
    descripcion: 'Blazer oversized con corte recto y solapas amplias. Forrado. Tela premium.',
    precio: 89990, precioAnterior: null, talles: ['S', 'M', 'L', 'XL'],
    badge: 'NUEVO', imagenes: ['/imgs/IMG_9976.PNG', '/imgs/IMG_9968.PNG'], stock: 10, disponible: true, orden: 1,
  },
  {
    id: '2', nombre: 'Jean Straight Selena', categoria: 'Denim', marca: 'SELENA DENIM',
    descripcion: 'Jean recto tiro alto con lavado claro. Rigido, sin elastano. Corte vintage.',
    precio: 54990, precioAnterior: null, talles: ['24', '26', '28', '30', '32'],
    badge: null, imagenes: ['/imgs/IMG_9975.PNG'], stock: 15, disponible: true, orden: 2,
  },
  {
    id: '3', nombre: 'Vestido Lino Toscana', categoria: 'Vestidos', marca: 'TOSCANA',
    descripcion: 'Vestido midi en lino puro. Corte evasé con breteles regulables. Ideal para el dia a dia con un toque elegante.',
    precio: 67990, precioAnterior: 79990, talles: ['S', 'M', 'L'],
    badge: 'SALE', imagenes: ['/imgs/IMG_9971.PNG'], stock: 5, disponible: true, orden: 3,
  },
  {
    id: '4', nombre: 'Remera Basica Premium', categoria: 'Remeras', marca: 'ROMA STUDIO',
    descripcion: 'Remera de algodon pima. Corte relajado, cuello redondo. La basica perfecta.',
    precio: 24990, precioAnterior: null, talles: ['S', 'M', 'L', 'XL'],
    badge: null, imagenes: ['/imgs/IMG_9972.PNG'], stock: 30, disponible: true, orden: 4,
  },
  {
    id: '5', nombre: 'Pantalon Palazzo Roma', categoria: 'Pantalones', marca: 'ROMA STUDIO',
    descripcion: 'Pantalon palazzo de tiro alto. Tela fluida con caida impecable. Cierre lateral invisible.',
    precio: 49990, precioAnterior: null, talles: ['S', 'M', 'L'],
    badge: 'NUEVO', imagenes: ['/imgs/IMG_9974.PNG'], stock: 12, disponible: true, orden: 5,
  },
  {
    id: '6', nombre: 'Campera Cuero Berlina', categoria: 'Abrigos', marca: 'MILANO',
    descripcion: 'Campera de eco-cuero con cierres metalicos. Corte cropped. Forro interior de saten.',
    precio: 119990, precioAnterior: null, talles: ['S', 'M', 'L'],
    badge: null, imagenes: ['/imgs/IMG_9970.PNG'], stock: 8, disponible: true, orden: 6,
  },
  {
    id: '7', nombre: 'Sweater Oversize Oslo', categoria: 'Abrigos', marca: 'OSLO KNITS',
    descripcion: 'Sweater tejido grueso con cuello bote. Hilado de lana y acrilico. Ultra suave.',
    precio: 59990, precioAnterior: 69990, talles: ['Unico'],
    badge: 'SALE', imagenes: ['/imgs/IMG_9977.PNG', '/imgs/IMG_9973.PNG'], stock: 7, disponible: true, orden: 7,
  },
  {
    id: '8', nombre: 'Jean Mom Mia', categoria: 'Denim', marca: 'SELENA DENIM',
    descripcion: 'Jean mom fit con rotos sutiles. Tiro alto, pierna amplia. Lavado medio.',
    precio: 52990, precioAnterior: null, talles: ['24', '26', '28', '30'],
    badge: null, imagenes: ['/imgs/IMG_9977.PNG'], stock: 20, disponible: true, orden: 8,
  },
  {
    id: '9', nombre: 'Top Crop Santorini', categoria: 'Remeras', marca: 'TOSCANA',
    descripcion: 'Top cropped con mangas abullonadas. Tela de algodon con textura. Espalda con lazo.',
    precio: 29990, precioAnterior: null, talles: ['S', 'M', 'L'],
    badge: 'NUEVO', imagenes: ['/imgs/IMG_9969.PNG'], stock: 18, disponible: true, orden: 9,
  },
  {
    id: '10', nombre: 'Vestido Camisero Paris', categoria: 'Vestidos', marca: 'VIENA ATELIER',
    descripcion: 'Vestido camisero largo con cinturon. Tela de viscosa. Manga larga con puño.',
    precio: 74990, precioAnterior: null, talles: ['S', 'M', 'L', 'XL'],
    badge: null, imagenes: ['/imgs/IMG_9968.PNG'], stock: 9, disponible: true, orden: 10,
  },
  {
    id: '11', nombre: 'Pantalon Cargo Urban', categoria: 'Pantalones', marca: 'ROMA STUDIO',
    descripcion: 'Pantalon cargo con bolsillos laterales. Tela gabardina elastizada. Cintura ajustable.',
    precio: 46990, precioAnterior: null, talles: ['S', 'M', 'L', 'XL'],
    badge: null, imagenes: ['/imgs/IMG_9971.PNG'], stock: 14, disponible: true, orden: 11,
  },
  {
    id: '12', nombre: 'Cartera Mini Firenze', categoria: 'Accesorios', marca: 'FIRENZE',
    descripcion: 'Cartera mini con cadena dorada. Eco-cuero texturizado. Compartimento interior con cierre.',
    precio: 39990, precioAnterior: 49990, talles: ['Unico'],
    badge: 'SALE', imagenes: ['/imgs/IMG_9973.PNG'], stock: 6, disponible: true, orden: 12,
  },
  {
    id: '13', nombre: 'Camisa Seda Capri', categoria: 'Remeras', marca: 'CAPRI SILK',
    descripcion: 'Camisa de saten con caida de seda. Cuello clasico, manga larga. Botones forrados.',
    precio: 44990, precioAnterior: null, talles: ['S', 'M', 'L'],
    badge: null, imagenes: ['/imgs/IMG_9973.PNG'], stock: 11, disponible: true, orden: 13,
  },
  {
    id: '14', nombre: 'Tapado Largo Viena', categoria: 'Abrigos', marca: 'VIENA ATELIER',
    descripcion: 'Tapado largo con botonadura simple. Tela pano. Bolsillos laterales. El abrigo ideal para el invierno.',
    precio: 139990, precioAnterior: null, talles: ['S', 'M', 'L'],
    badge: 'NUEVO', imagenes: ['/imgs/IMG_9970.PNG', '/imgs/IMG_9974.PNG'], stock: 4, disponible: true, orden: 14,
  },
  {
    id: '15', nombre: 'Falda Midi Plisada', categoria: 'Vestidos', marca: 'TOSCANA',
    descripcion: 'Falda midi plisada con cintura elastizada. Tela satinada con vuelo. Largo debajo de la rodilla.',
    precio: 42990, precioAnterior: null, talles: ['S', 'M', 'L'],
    badge: null, imagenes: ['/imgs/IMG_9972.PNG'], stock: 13, disponible: true, orden: 15,
  },
  {
    id: '16', nombre: 'Cinturon Doble Hebilla', categoria: 'Accesorios', marca: 'FIRENZE',
    descripcion: 'Cinturon de eco-cuero con doble hebilla metalica. Ancho 3cm. El detalle que completa tu look.',
    precio: 19990, precioAnterior: null, talles: ['S/M', 'M/L'],
    badge: 'ULTIMAS', imagenes: ['/imgs/IMG_9976.PNG'], stock: 3, disponible: true, orden: 16,
  },
]

export const defaultTestimonios = [
  { id: '1', nombre: 'Carolina M.', texto: 'La calidad de las prendas es increible. Siempre encuentro algo que me encanta. Mi boutique favorita de la zona.' },
  { id: '2', nombre: 'Luciana G.', texto: 'Me encanta la atencion personalizada. Te asesoran con mucho gusto y siempre te vas feliz con tu compra.' },
  { id: '3', nombre: 'Valentina R.', texto: 'Los talles son exactos y la ropa es tal cual se ve en las fotos. Muy recomendable.' },
  { id: '4', nombre: 'Milagros S.', texto: 'Pedi por WhatsApp y me llego perfecto. Excelente servicio y prendas de primera calidad.' },
]

export const defaultFaqs = [
  { pregunta: 'Hacen envios a todo el pais?', respuesta: 'Si, realizamos envios a todo el pais a traves de correo. Los envios dentro de Añatuya son sin cargo.' },
  { pregunta: 'Como puedo saber mi talle?', respuesta: 'Podes consultar nuestra guia de talles o escribirnos por WhatsApp y te asesoramos personalmente con las medidas de cada prenda.' },
  { pregunta: 'Aceptan cambios?', respuesta: 'Si, aceptamos cambios dentro de los 15 dias de la compra presentando el ticket. La prenda debe estar en perfectas condiciones, sin uso y con etiquetas.' },
  { pregunta: 'Que medios de pago aceptan?', respuesta: 'Aceptamos efectivo, transferencia bancaria y todas las tarjetas de debito y credito. Consulta las cuotas disponibles.' },
  { pregunta: 'Como compro por WhatsApp?', respuesta: 'Agrega los productos al carrito, completa tus datos y hace click en "Finalizar compra por WhatsApp". Se abrira una conversacion con tu pedido listo.' },
  { pregunta: 'Cual es el horario de atencion?', respuesta: 'Nuestro local atiende de Lunes a Sabado de 9:00 a 13:00 y de 17:00 a 21:00. Por WhatsApp respondemos en horario extendido.' },
]

export const defaultBanners = [
  {
    id: '1', imagen: '/imgs/IMG_9973.PNG', titulo: 'LOOKBOOK INVIERNO', subtitulo: 'Las tendencias que vas a amar esta temporada',
    textoBoton: 'VER MAS', linkBoton: '#productos', posicionTexto: 'center', ubicacion: 'pre-productos', orden: 1,
  },
]

export const defaultInstagramPhotos = [
  { id: '1', imagen: '/imgs/IMG_9968.PNG', orden: 1 },
  { id: '2', imagen: '/imgs/IMG_9971.PNG', orden: 2 },
  { id: '3', imagen: '/imgs/IMG_9972.PNG', orden: 3 },
  { id: '4', imagen: '/imgs/IMG_9974.PNG', orden: 4 },
  { id: '5', imagen: '/imgs/IMG_9976.PNG', orden: 5 },
  { id: '6', imagen: '/imgs/IMG_9977.PNG', orden: 6 },
]

export const defaultPromos = [
  'ENVIOS A TODO EL PAIS',
  '3 CUOTAS SIN INTERES',
  'NUEVOS INGRESOS TODAS LAS SEMANAS',
  '15% OFF CON TRANSFERENCIA',
]
