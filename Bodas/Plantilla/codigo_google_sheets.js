/**
 * ============================================================================
 * 📋 CÓDIGO MAESTRO DE GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * Estructura de 5 Columnas con Validación de Casillas y Eliminación:
 * [Nombre] | [Pases] | [Confirmado: Sí ✅ / No ❌ / Pendiente] | [Fecha_Confirmacion] | [Link_Invitacion]
 * ============================================================================
 * 
 * Funciona para: XV Años, Bodas y Fiestas Sociales.
 * Crea automáticamente las 5 columnas, configura la Columna C como lista
 * desplegable interactiva (Sí / No / Pendiente) y permite eliminar/actualizar pases.
 */

// 🟢 FUNCIÓN PARA EL BOTÓN "▷ Run" (Crea las columnas y casillas desplegables)
function inicializarHoja() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  setupHeadersIfEmpty(sheet);
  aplicarValidaciones(sheet);
  Logger.log("✅ ¡Conexión exitosa! Las 5 columnas y las casillas desplegables (Sí / No / Pendiente) quedaron configuradas en tu hoja.");
}

// Configura la Columna C como casilla de lista desplegable (Sí / No / Pendiente)
function aplicarValidaciones(sheet) {
  try {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Sí ✅", "No ❌", "Pendiente"], true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange("C2:C1000").setDataValidation(rule);
  } catch (err) {
    Logger.log("Nota: " + err.toString());
  }
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
    aplicarValidaciones(sheet);
  } else {
    aplicarValidaciones(sheet);
  }
}

// 📥 LECTURA DE INVITADOS (GET) -> Lee la hoja para el Panel Admin y Confirmados
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    for (var i = 1; i < rows.length; i++) {
      var nom = rows[i][0] ? rows[i][0].toString().trim() : "";
      if (nom !== "") {
        result.push({
          nombre: nom,
          familia: nom,
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

// 📤 ESCRITURA, ACTUALIZACIÓN Y ELIMINACIÓN (POST)
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "Servicio doPost activo y listo para recibir datos." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(e.postData.contents);
    var nombre = (data.nombre || data.familia || "").toString().trim();
    
    if (!nombre) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Nombre no especificado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getDataRange().getValues();

    // 🗑️ ACCIÓN 1: ELIMINAR INVITADO DE LA HOJA
    if (data.action === "delete" || data.eliminar) {
      var borrado = false;
      for (var i = rows.length - 1; i >= 1; i--) {
        if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === nombre.toLowerCase()) {
          sheet.deleteRow(i + 1);
          borrado = true;
        }
      }
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", action: "delete", nombre: nombre, borrado: borrado }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ✏️ ACCIÓN 2: GUARDAR O ACTUALIZAR
    var pases = data.pases ? parseInt(data.pases) : 1;
    var confirmado = (data.confirmado || "Sí ✅").toString().trim();
    var fecha = data.fecha_confirmacion || (confirmado.toLowerCase().includes("sí") ? new Date().toLocaleString("es-MX") : (confirmado.toLowerCase().includes("no") ? new Date().toLocaleString("es-MX") + " (Declinó)" : ""));
    var link = (data.link_invitacion || data.link || "").toString().trim();
    
    var encontrada = false;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === nombre.toLowerCase()) {
        if (data.pases) sheet.getRange(i + 1, 2).setValue(pases);
        if (data.confirmado) sheet.getRange(i + 1, 3).setValue(confirmado);
        if (data.fecha_confirmacion || fecha) sheet.getRange(i + 1, 4).setValue(fecha);
        if (link) sheet.getRange(i + 1, 5).setValue(link);
        encontrada = true;
        break;
      }
    }
    
    // Si no existía, agregar fila con las 5 columnas
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
