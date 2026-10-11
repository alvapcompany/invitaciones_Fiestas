/**
 * ============================================================================
 * 📋 CÓDIGO MAESTRO DE GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * Estructura de 5 Columnas:
 * [Nombre] | [Pases] | [Confirmado] | [Fecha_Confirmacion] | [Link_Invitacion]
 * ============================================================================
 * 
 * Funciona para: XV Años, Bodas y Fiestas Sociales.
 * Detecta automáticamente si la hoja está vacía y crea las 5 columnas con estilo.
 * 
 * INSTRUCCIONES:
 * 1. Pega este código en Extensiones > Apps Script.
 * 2. Si quieres probarlo aquí mismo, presiona "▷ Run" (Ejecutar) con la función 
 *    "inicializarHoja" y verás que en tu hoja se crean los encabezados en amarillo.
 * 3. Para conectarlo a tu web: Haz clic en "Implementar" (botón azul arriba) 
 *    > "Nueva implementación" > Tipo "Aplicación web" > Quién tiene acceso: "Cualquier persona" (Anyone).
 * 4. Copia la URL que termina en "/exec".
 * ============================================================================
 */

// 🟢 FUNCIÓN DE PRUEBA Y CREACIÓN DE COLUMNAS (Para el botón "▷ Run" / "▷ Ejecutar")
function inicializarHoja() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  setupHeadersIfEmpty(sheet);
  Logger.log("✅ ¡Conexión exitosa! Las 5 columnas quedaron configuradas en tu hoja de Google Sheets.");
}

// Crea las 5 columnas automáticamente si la hoja está vacía
function setupHeadersIfEmpty(sheet) {
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Nombre", "Pases", "Confirmado", "Fecha_Confirmacion", "Link_Invitacion"]);
    sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#fef08a").setFontColor("#1a1202");
    sheet.setFrozenRows(1);
  }
}

// 📥 LECTURA DE INVITADOS (GET) -> Lee la hoja para el Panel Admin y Confirmados
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    // Si solo están los encabezados en la fila 1
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Recorremos desde la fila 2
    for (var i = 1; i < rows.length; i++) {
      var nom = rows[i][0] ? rows[i][0].toString().trim() : "";
      if (nom !== "") {
        result.push({
          nombre: nom,
          familia: nom, // Compatibilidad con ambos nombres
          pases: rows[i][1] ? parseInt(rows[i][1]) || 1 : 1,
          confirmado: rows[i][2] ? rows[i][2].toString().trim() : "Pendiente",
          fecha_confirmacion: rows[i][3] ? rows[i][3].toString() : "",
          link_invitacion: rows[i][4] ? rows[i][4].toString().trim() : "",
          link: rows[i][4] ? rows[i][4].toString().trim() : ""
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

// 📤 ESCRITURA Y ACTUALIZACIÓN (POST) -> Guarda pases generados o confirmaciones
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    
    // Si se corre de prueba en el editor sin datos postData
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "Servicio doPost activo y listo para recibir datos." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(e.postData.contents);
    var nombre = (data.nombre || data.familia || "").toString().trim();
    var pases = data.pases ? parseInt(data.pases) : 1;
    var confirmado = (data.confirmado || "Sí ✅").toString().trim();
    var fecha = data.fecha_confirmacion || (confirmado.toLowerCase().includes("sí") ? new Date().toLocaleString("es-MX") : "");
    var link = (data.link_invitacion || data.link || "").toString().trim();
    
    if (!nombre) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Nombre no especificado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = sheet.getDataRange().getValues();
    var encontrada = false;
    
    // Buscar si el invitado ya existe para actualizarlo sin duplicar
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === nombre.toLowerCase()) {
        if (data.pases) {
          sheet.getRange(i + 1, 2).setValue(pases);
        }
        if (data.confirmado) {
          sheet.getRange(i + 1, 3).setValue(confirmado);
        }
        if (fecha) {
          sheet.getRange(i + 1, 4).setValue(fecha);
        }
        if (link) {
          sheet.getRange(i + 1, 5).setValue(link);
        }
        encontrada = true;
        break;
      }
    }
    
    // Si no existía, agregar una nueva fila al final con las 5 columnas
    if (!encontrada) {
      sheet.appendRow([nombre, pases, confirmado, fecha, link]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        nombre: nombre,
        pases: pases,
        confirmado: confirmado,
        link_invitacion: link
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
