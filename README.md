# 💌 Invitaciones_Fiestas — Alva P Company

Repositorio oficial de invitaciones digitales interactivas para eventos sociales (XV Años, Bodas, Bautizos, Aniversarios), desplegado mediante **GitHub Pages**.

🔗 **URL del Sitio Web (GitHub Pages):**  
👉 **[https://alvapcompany.github.io/invitaciones_Fiestas/](https://alvapcompany.github.io/invitaciones_Fiestas/)**

---

## 📂 Estructura del Repositorio

El proyecto está diseñado de forma modular por cliente/evento:

```text
├── index.html                   # Portal principal que lista las invitaciones activas
├── .gitignore                   # Ignora archivos temporales del editor
├── XV_Britney/                  # ⭐ NUEVA VERSIÓN MEJORADA (XV Britney)
│   ├── index.html               # Invitación digital con animaciones de gala, música y RSVP
│   ├── admin.html               # Generador de pases personalizados para WhatsApp
│   ├── confirmados.html         # Tablero en tiempo real de asistencia conectada a Sheets
│   ├── codigo_google_sheets.js  # Script de Google Apps Script listo para copiar y pegar
│   ├── musica.mp3               # Audio de fondo
│   └── fotos/                   # Galería de fotos (portada, fotos 1 a 7)
└── XV/                          # Versión previa / de respaldo
    ├── index.html
    ├── admin.html
    ├── confirmados.html
    ├── musica.mp3
    └── fotos/
```

---

## 🚀 Enlaces Directos del Evento (XV Britney)

- **Invitación Digital:**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV_Britney/`
- **Pase Personalizado (Ejemplo con Familia y Pases):**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV_Britney/?n=Morales&p=3`
- **Panel de Pases & Generador WhatsApp:**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV_Britney/admin.html`
- **Tablero de Confirmados:**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV_Britney/confirmados.html`

---

## 📝 Guía Rápida: Cómo Crear una Nueva Invitación para Otro Cliente

Para crear una nueva invitación (por ejemplo para una boda o unos nuevos XV años):

1. **Duplica una carpeta existente**:
   - Copia la carpeta `XV_Britney` y cámbiale el nombre a `Boda_Carlos_Ana` o `XV_Valeria`.

2. **Reemplaza fotos y música**:
   - En la subcarpeta `fotos/`, coloca las nuevas imágenes (conservando los nombres o actualizándolos en `index.html`).
   - Reemplaza `musica.mp3` con la canción deseada.

3. **Configura Google Sheets**:
   - Crea una nueva hoja en Google Sheets con las columnas: `Familia`, `Pases`, `Confirmado`, `Fecha_Confirmacion`.
   - Ve a **Extensiones > Apps Script**, pega el código de `codigo_google_sheets.js`.
   - Haz clic en **Implementar > Nueva implementación**, elige **Aplicación Web**, acceso para **Cualquiera**, y copia la URL terminada en `/exec`.

4. **Actualiza la URL y datos en el código**:
   - Abre `index.html`, `admin.html` y `confirmados.html` del nuevo cliente.
   - En la parte superior de `<script>`, busca el bloque:
     ```javascript
     const CONFIG_INVITACION = {
         GOOGLE_SHEETS_URL: 'TU_NUEVA_URL_DE_APPS_SCRIPT_AQUI',
         WHATSAPP_PHONE: '52XXXXXXXXXX',
         NOMBRE_FESTEJADA: 'Nombre del Cliente',
         FECHA_EVENTO: new Date(2026, 11, 15, 18, 0, 0)
     };
     ```
   - ¡Listo! Sube los cambios con `git push` y la nueva invitación estará disponible en:  
     `https://alvapcompany.github.io/invitaciones_Fiestas/Nombre_Carpeta/`
