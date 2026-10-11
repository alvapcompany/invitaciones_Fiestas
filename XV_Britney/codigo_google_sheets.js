/**
 * ============================================================================
 * 📋 CÓDIGO DE GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * ============================================================================
 * 
 * INSTRUCCIONES PARA VINCULAR TU GOOGLE SHEETS:
 * ----------------------------------------------------------------------------
 * 1. En Google Drive, crea una nueva hoja de cálculo llamada por ejemplo:
 *    "Invitados XV Britney" (o el nombre de tu cliente).
 * 
 * 2. En la fila 1 de la hoja, crea las siguientes columnas:
 *    Columna A: Familia
 *    Columna B: Pases
 *    Columna C: Confirmado
 *    Columna D: Fecha_Confirmacion
 * 
 * 3. En la barra superior de Google Sheets, ve a:
 *    Extensiones -> Apps Script
 * 
 * 4. Borra todo el código que aparezca y pega este código completo.
 * 
 * 5. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
 *    - Tipo: Aplicación web
 *    - Descripción: API Invitaciones
 *    - Ejecutar como: Yo (tu correo)
 *    - Quién tiene acceso: Cualquier persona (Cualquiera / Anyone)  <-- ¡IMPORTANTE!
 * 
 * 6. Copia la "URL de la aplicación web" que termina en `/exec`.
 * 
 * 7. Pega esa URL en la constante `GOOGLE_SHEETS_URL` dentro de:
 *    - XV_Britney/index.html
 *    - XV_Britney/admin.html
 *    - XV_Britney/confirmados.html
 * ============================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Obtener todas las filas existentes
    var rows = sheet.getDataRange().getValues();
    var familia = (data.familia || "").toString().trim();
    var confirmado = (data.confirmado || "Sí ✅").toString().trim();
    var pases = data.pases || 1;
    var fecha = data.fecha_confirmacion || new Date().toLocaleString("es-MX");
    
    var encontrada = false;
    
    // Buscar si la familia ya existe en la lista (recorremos a partir de la fila 2)
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === familia.toLowerCase()) {
        sheet.getRange(i + 1, 3).setValue(confirmado);
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

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    // Leer filas omitiendo el encabezado
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
