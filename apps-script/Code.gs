/**
 * Isabella Añatuya Boutique — sync backend (Google Apps Script)
 *
 * This script receives writes from the Next.js site and persists them
 * to the bound Google Sheet. Read path is unchanged (the site reads
 * via gviz as before), this only handles WRITES.
 *
 * Deploy as Web App:
 *  - Execute as: Me (the sheet owner)
 *  - Who has access: Anyone
 *
 * Before deploying, set a Script Property:
 *  Project Settings → Script Properties → Add property
 *    key:   SYNC_SECRET
 *    value: <long random string, the same you put in SYNC_SECRET env var on Vercel>
 */

const PEDIDOS_SHEET = 'Pedidos';
const PEDIDOS_HEADERS = ['ID', 'Fecha', 'Cliente', 'Notas', 'Total', 'Estado', 'Items'];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SYNC_SECRET');

    if (!expected || body.secret !== expected) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }

    switch (body.action) {
      case 'overwrite':   return jsonOut(handleOverwrite(body));
      case 'appendOrder': return jsonOut(handleAppendOrder(body));
      case 'listOrders':  return jsonOut(handleListOrders());
      case 'updateOrder': return jsonOut(handleUpdateOrder(body));
      case 'deleteOrder': return jsonOut(handleDeleteOrder(body));
      default:
        return jsonOut({ ok: false, error: 'unknown action: ' + body.action });
    }
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// Health check: opening the web app URL in the browser returns "ok".
function doGet() {
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Full overwrite of a content sheet (Productos, Hero, Categorias, Marcas,
 * Banners, Testimonios, Instagram, Promos, Config).
 *
 * body = { sheet: 'Productos', rows: [ { ID, Nombre, ... }, ... ] }
 *
 * Strategy: clear the entire sheet and rewrite headers + rows from scratch.
 * Headers are taken from the keys of the first row. If rows is empty, the
 * sheet is cleared but its headers are kept so parsers don't break.
 */
function handleOverwrite(body) {
  const { sheet, rows } = body;
  if (!sheet) return { ok: false, error: 'missing sheet' };
  if (!Array.isArray(rows)) return { ok: false, error: 'rows must be an array' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(sheet);
  if (!sh) sh = ss.insertSheet(sheet);

  if (rows.length === 0) {
    // Keep the header row, clear the rest
    const last = sh.getLastRow();
    if (last > 1) sh.getRange(2, 1, last - 1, sh.getLastColumn() || 1).clearContent();
    return { ok: true, written: 0 };
  }

  const headers = Object.keys(rows[0]);
  const matrix = rows.map(r => headers.map(h => (r[h] === undefined || r[h] === null ? '' : r[h])));

  sh.clear();
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(2, 1, matrix.length, headers.length).setValues(matrix);

  return { ok: true, written: rows.length };
}

/**
 * Append a single order to the Pedidos sheet. Creates the sheet and
 * writes headers if it doesn't exist yet.
 *
 * body = { order: { id, fecha, cliente, notas, total, estado, items: [...] } }
 */
function handleAppendOrder(body) {
  const order = body.order;
  if (!order || !order.id) return { ok: false, error: 'missing order.id' };

  const sh = getOrCreatePedidosSheet();

  // Prevent duplicate appends if the client retries
  const existingId = findOrderRow(sh, order.id);
  if (existingId !== -1) return { ok: true, duplicate: true };

  sh.appendRow([
    order.id,
    order.fecha || new Date().toISOString(),
    order.cliente || '',
    order.notas || '',
    Number(order.total) || 0,
    order.estado || 'pendiente',
    JSON.stringify(order.items || []),
  ]);

  return { ok: true };
}

/**
 * List all orders from the Pedidos sheet. Returns newest first.
 */
function handleListOrders() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PEDIDOS_SHEET);
  if (!sh || sh.getLastRow() < 2) return { ok: true, orders: [] };

  const values = sh.getRange(2, 1, sh.getLastRow() - 1, PEDIDOS_HEADERS.length).getValues();
  const orders = values.map(row => ({
    id: String(row[0] || ''),
    fecha: row[1] instanceof Date ? row[1].toISOString() : String(row[1] || ''),
    cliente: String(row[2] || ''),
    notas: String(row[3] || ''),
    total: Number(row[4]) || 0,
    estado: String(row[5] || 'pendiente'),
    items: safeParseJson(row[6]),
  })).filter(o => o.id);

  orders.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  return { ok: true, orders };
}

/**
 * Update the Estado column of a specific order by ID.
 *
 * body = { id: 'IS-...', estado: 'confirmado' }
 */
function handleUpdateOrder(body) {
  const { id, estado } = body;
  if (!id || !estado) return { ok: false, error: 'missing id or estado' };

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PEDIDOS_SHEET);
  if (!sh) return { ok: false, error: 'Pedidos sheet does not exist' };

  const row = findOrderRow(sh, id);
  if (row === -1) return { ok: false, error: 'order not found' };

  // Estado is column 6 (1-indexed)
  sh.getRange(row, 6).setValue(estado);
  return { ok: true };
}

/**
 * Delete a specific order by ID.
 */
function handleDeleteOrder(body) {
  const { id } = body;
  if (!id) return { ok: false, error: 'missing id' };

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PEDIDOS_SHEET);
  if (!sh) return { ok: false, error: 'Pedidos sheet does not exist' };

  const row = findOrderRow(sh, id);
  if (row === -1) return { ok: false, error: 'order not found' };

  sh.deleteRow(row);
  return { ok: true };
}

// ---------- helpers ----------

function getOrCreatePedidosSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(PEDIDOS_SHEET);
  if (!sh) {
    sh = ss.insertSheet(PEDIDOS_SHEET);
    sh.getRange(1, 1, 1, PEDIDOS_HEADERS.length).setValues([PEDIDOS_HEADERS]);
  } else if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, PEDIDOS_HEADERS.length).setValues([PEDIDOS_HEADERS]);
  }
  return sh;
}

function findOrderRow(sh, id) {
  if (sh.getLastRow() < 2) return -1;
  const ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function safeParseJson(s) {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}
