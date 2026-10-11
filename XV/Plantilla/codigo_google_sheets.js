/**
 * ============================================================================
 * 📋 CÓDIGO MAESTRO DE GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * (Funciona para XV Años, Bodas y Fiestas)
 * ============================================================================
 * 
 * Este código detecta automáticamente tu hoja, crea los encabezados si está vacía,
 * lee los invitados para el panel Admin y guarda las confirmaciones en tiempo real.
 * 
 * PASOS RÁPIDOS (SOLO COPIAR Y PEGAR):
 * ----------------------------------------------------------------------------
 * 1. En tu Google Spreadsheet (Hoja de cálculo):
 *    Ve al menú superior: Extensiones > Apps Script
 * 
 * 2. Borra TODO lo que haya en la pantalla y pega este archivo completo.
 * 
 * 3. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
 *    - Tipo: Aplicación web
 *    - Descripción: API Invitaciones
 *    - Ejecutar como: Yo (tu correo)
 *    - Quién tiene acceso: Cualquier persona (Anyone)  <--- ¡MUY IMPORTANTE!
 * 
 * 4. Haz clic en "Implementar", autoriza los permisos y copia la "URL de la aplicación web"
 *    (la que termina en "/exec").
 * 
 * 5. Pega esa URL en tu Panel Admin o en la variable GOOGLE_SHEETS_URL. ¡Listo!
 * ============================================================================
 */

function setupHeadersIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Familia", "Pases", "Confirmado", "Fecha_Confirmacion"]);
    sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#e0f7fa");
  }
}

// LECTURA DE INVITADOS (GET) -> Alimenta el Panel Admin y Confirmados
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    // Si solo está el encabezado
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Recorremos las filas desde la fila 2
    for (var i = 1; i < rows.length; i++) {
      var fam = rows[i][0] ? rows[i][0].toString().trim() : "";
      if (fam !== "") {
        result.push({
          familia: fam,
          pases: rows[i][1] ? parseInt(rows[i][1]) || 1 : 1,
          confirmado: rows[i][2] ? rows[i][2].toString().trim() : "Pendiente",
          fecha_confirmacion: rows[i][3] ? rows[i][3].toString() : ""
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ESCRITURA Y ACTUALIZACIÓN (POST) -> Guarda nuevos invitados o confirmaciones
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    
    var data = JSON.parse(e.postData.contents);
    var familia = (data.familia || "").toString().trim();
    var pases = data.pases ? parseInt(data.pases) : 1;
    var confirmado = (data.confirmado || "Sí ✅").toString().trim();
    var fecha = data.fecha_confirmacion || new Date().toLocaleString("es-MX");
    
    if (!familia) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Familia no especificada" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = sheet.getDataRange().getValues();
    var encontrada = false;
    
    // Buscar si ya existe la familia para actualizarla
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === familia.toLowerCase()) {
        if (data.pases) {
          sheet.getRange(i + 1, 2).setValue(pases);
        }
        if (data.confirmado) {
          sheet.getRange(i + 1, 3).setValue(confirmado);
        }
        sheet.getRange(i + 1, 4).setValue(fecha);
        encontrada = true;
        break;
      }
    }
    
    // Si no existía, agregarla al final
    if (!encontrada) {
      sheet.appendRow([familia, pases, confirmado, fecha]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", familia: familia, confirmado: confirmado }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
