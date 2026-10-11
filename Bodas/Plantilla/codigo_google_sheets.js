/**
 * ============================================================================
 * 📋 CÓDIGO DE GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * ============================================================================
 * 
 * GUÍA DE 3 PASOS PARA VINCULAR TU GOOGLE SHEETS:
 * ----------------------------------------------------------------------------
 * 1. En Google Drive, crea una hoja de cálculo llamada por ejemplo:
 *    "Invitados XV Britney" (o el nombre de tu cliente).
 * 
 * 2. En la fila 1 de la hoja, coloca las siguientes 4 columnas:
 *    Columna A: Familia
 *    Columna B: Pases
 *    Columna C: Confirmado
 *    Columna D: Fecha_Confirmacion
 * 
 * 3. En el menú superior de Google Sheets, ve a:
 *    Extensiones -> Apps Script
 *    - Borra el código existente y pega este archivo completo.
 *    - Haz clic en "Implementar" (arriba a la derecha) -> "Nueva implementación".
 *    - Selecciona tipo: "Aplicación web".
 *    - Ejecutar como: "Yo".
 *    - Quién tiene acceso: "Cualquiera" (Anyone)  <-- ¡IMPORTANTE!
 *    - Haz clic en "Implementar" y copia la URL terminada en `/exec`.
 * 
 * 4. Pega esa URL en `GOOGLE_SHEETS_URL` dentro de:
 *    - index.html
 *    - admin.html
 *    - confirmados.html
 * ============================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var rows = sheet.getDataRange().getValues();
    var familia = (data.familia || "").toString().trim();
    var confirmado = (data.confirmado || "Sí ✅").toString().trim();
    var pases = data.pases || 1;
    var fecha = data.fecha_confirmacion || new Date().toLocaleString("es-MX");
    
    var encontrada = false;
    
    // Buscar si ya existe la familia
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === familia.toLowerCase()) {
        sheet.getRange(i + 1, 3).setValue(confirmado);
        sheet.getRange(i + 1, 4).setValue(fecha);
        encontrada = true;
        break;
      }
    }
    
    // Si no existía, agregar fila
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

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0]) {
        result.push({
          familia: rows[i][0],
          pases: rows[i][1] || 1,
          confirmado: rows[i][2] || "Pendiente",
          fecha_confirmacion: rows[i][3] || ""
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
