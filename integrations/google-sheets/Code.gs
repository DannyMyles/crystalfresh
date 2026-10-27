/**
 * Crystal Fresh Hydrolife – website submissions log for Google Sheets.
 *
 * Every form submission from the website is appended as a row, with one tab
 * per form (Order, Quote, Contact). Setup steps are in README.md next
 * to this file.
 */

var TAB_NAMES = { order: "Orders", quote: "Quotations", contact: "Messages" };
var FIXED_HEADERS = ["Received (Kenya time)", "Reference", "Reply-to email"];

function doPost(e) {
  try {
    var expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (!expected) return respond({ ok: false, error: "WEBHOOK_SECRET script property is not set" });
    if (!e || !e.parameter || e.parameter.secret !== expected) return respond({ ok: false, error: "unauthorized" });

    var payload = JSON.parse(e.postData.contents);
    if (!payload || !payload.reference || !Array.isArray(payload.fields)) {
      return respond({ ok: false, error: "invalid payload" });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      appendSubmission(SpreadsheetApp.getActiveSpreadsheet(), payload);
    } finally {
      lock.releaseLock();
    }
    return respond({ ok: true, reference: payload.reference });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

function appendSubmission(spreadsheet, payload) {
  var tabName = TAB_NAMES[payload.formId] || "Other";
  var sheet = spreadsheet.getSheetByName(tabName) || spreadsheet.insertSheet(tabName);

  var headers = sheet.getLastColumn() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  if (headers.length === 0) headers = FIXED_HEADERS.slice();

  payload.fields.forEach(function (field) {
    if (headers.indexOf(field.label) === -1) headers.push(field.label);
  });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
  sheet.setFrozenRows(1);

  var values = {};
  values[FIXED_HEADERS[0]] = Utilities.formatDate(new Date(payload.submittedAt), "Africa/Nairobi", "yyyy-MM-dd HH:mm");
  values[FIXED_HEADERS[1]] = payload.reference;
  values[FIXED_HEADERS[2]] = payload.replyTo || "";
  payload.fields.forEach(function (field) {
    values[field.label] = field.value || "";
  });

  var row = headers.map(function (header) {
    return asPlainText(values[header] === undefined ? "" : values[header]);
  });
  sheet.appendRow(row);
}

/** Stops values such as "=HYPERLINK(...)" or "+254…" being treated as formulas or numbers. */
function asPlainText(value) {
  var text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
