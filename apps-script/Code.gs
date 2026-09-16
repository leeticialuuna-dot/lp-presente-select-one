/**
 * Recebe os envios do formulário da LP e grava uma linha na planilha
 * vinculada a este projeto do Apps Script.
 *
 * Como instalar: veja o passo a passo no README.md do projeto.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter || {};

  // >> CUSTOMIZAR: se adicionar/remover perguntas em js/questions.js,
  // atualize esta lista de colunas com os mesmos "id" das perguntas.
  var headers = ["timestamp", "nome", "whatsapp", "email", "negocio", "desafio"];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var row = headers.map(function (h) {
    if (h === "timestamp") return new Date();
    return params[h] || "";
  });

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
