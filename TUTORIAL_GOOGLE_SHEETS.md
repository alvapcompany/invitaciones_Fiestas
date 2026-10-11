# 📖 Tutorial Maestro: Vincular Google Sheets con tu Invitación Digital

Este tutorial te guía paso a paso para conectar tu hoja de Google Sheets en menos de 2 minutos. **Solo copiar y pegar.**

---

## 📌 Paso 1: Crear tu Hoja en Google Drive

1. Ve a [Google Sheets (drive.google.com)](https://sheets.google.com) y crea una **Hoja de cálculo en blanco**.
2. Dale un nombre arriba a la izquierda, por ejemplo: `Invitados XV Evento`.
3. *(Opcional)* No necesitas escribir los encabezados; el script los creará automáticamente si está vacía. Si deseas escribirlos tú mismo, escribe en la fila 1:
   * **Columna A:** `Familia`
   * **Columna B:** `Pases`
   * **Columna C:** `Confirmado`
   * **Columna D:** `Fecha_Confirmacion`

---

## 📌 Paso 2: Abrir Apps Script y Pegar el Código

1. En el menú superior de tu hoja de Google Sheets, haz clic en:  
   👉 **Extensiones > Apps Script**
2. Se abrirá una pestaña con un archivo llamado `Código.gs`.
3. **Borra todo el texto que aparezca** y pega el siguiente código completo:

```javascript
function setupHeadersIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Familia", "Pases", "Confirmado", "Fecha_Confirmacion"]);
    sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#e0f7fa");
  }
}

// LECTURA DE INVITADOS (GET)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeadersIfEmpty(sheet);
    var rows = sheet.getDataRange().getValues();
    var result = [];
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
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
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ESCRITURA Y ACTUALIZACIÓN (POST)
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
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Familia no especificada" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = sheet.getDataRange().getValues();
    var encontrada = false;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === familia.toLowerCase()) {
        if (data.pases) sheet.getRange(i + 1, 2).setValue(pases);
        if (data.confirmado) sheet.getRange(i + 1, 3).setValue(confirmado);
        sheet.getRange(i + 1, 4).setValue(fecha);
        encontrada = true;
        break;
      }
    }
    if (!encontrada) {
      sheet.appendRow([familia, pases, confirmado, fecha]);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success", familia: familia, confirmado: confirmado })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 📌 Paso 3: Publicar la Aplicación Web

> [!IMPORTANT]
> Este es el paso clave para que el navegador y tu página web puedan comunicarse con la hoja sin bloqueos.

1. Haz clic en el botón azul arriba a la derecha: **"Implementar" (Deploy) > "Nueva implementación"**.
2. Al lado de "Selecciona el tipo", haz clic en el ícono de engrane ⚙️ y elige **"Aplicación web"**.
3. Configura exactamente estos 3 campos:
   * **Descripción:** `API Invitaciones`
   * **Ejecutar como:** `Yo (tu_correo@gmail.com)`
   * **Quién tiene acceso:** **`Cualquier persona`** *(Anyone)*  ⚠️ **(¡Muy importante!)**
4. Haz clic en el botón azul **"Implementar"**.
5. Google te pedirá "Revisar permisos":
   * Elige tu cuenta de Google.
   * Si aparece "Google no ha verificado esta aplicación", haz clic abajo en **"Configuración avanzada"** (Advanced) y luego en **"Ir a Proyecto (no seguro)"**.
   * Haz clic en **"Permitir"** (Allow).
6. Google te mostrará una ventana con la **URL de la aplicación web**.  
   Tiene este formato:  
   `https://script.google.com/macros/s/AKfycb.../exec`  
   *(Asegúrate de copiar la URL que termina en `/exec`, no la que termina en `/dev`)*.

---

## 📌 Paso 4: Pegar tu URL en el Panel Admin

Tienes dos formas súper sencillas:

### Opción A (Sin tocar código, directamente desde tu navegador):
1. Abre tu Super Admin o Panel del Evento:  
   👉 `https://alvapcompany.github.io/invitaciones_Fiestas/superadmin.html`
2. En la barra superior verás el campo:  
   `[ Pega aquí la URL de tu Google Apps Script (/exec)... ]`
3. Pega tu enlace y haz clic en **"Guardar URL"**.
4. ¡Listo! Verás el indicador verde: `🟢 Conectado a Sheets`.

### Opción B (En los archivos de tu proyecto):
Abre `index.html`, `admin.html` y `confirmados.html` y en la parte superior cambia:
```javascript
GOOGLE_SHEETS_URL: 'TU_URL_DE_APPS_SCRIPT_AQUI'
```
Guarda y haz `git push`.

---

## 📁 Uso de las Plantillas por Categoría

En tu proyecto tienes 3 carpetas listas para duplicar:

1. **`XV/Plantilla/`** → Para quinceañeras.
2. **`Bodas/Plantilla/`** → Para matrimonios.
3. **`Fiestas/Plantilla/`** → Para cumpleaños, graduaciones y aniversarios.

Para crear un nuevo cliente:
* Simplemente copia la carpeta `Plantilla` respectiva, renómbrala con el nombre del cliente (ej. `XV/Valeria/`), vincula su Google Sheets y ¡listo!
