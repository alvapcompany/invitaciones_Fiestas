# 💌 Invitaciones_Fiestas — Alva P Company

Plataforma oficial de invitaciones digitales de alta gama (XV Años, Bodas y Fiestas Sociales), hospedada y desplegada globalmente en **GitHub Pages**.

🔗 **URL del Sitio Web en Vivo (GitHub Pages):**  
👉 **[https://alvapcompany.github.io/invitaciones_Fiestas/](https://alvapcompany.github.io/invitaciones_Fiestas/)**

---

## 📂 Arquitectura Organizada por Categoría

El repositorio está distribuido en 3 categorías principales para una gestión limpia, ordenada y escalable:

```text
├── index.html                   # 🏛️ Portal Principal con filtros (XV, Bodas, Fiestas) y buscador
├── .gitignore                   # Exclusiones de archivos del editor y temporales
├── README.md                    # Documentación completa
│
├── XV/                          # 👑 CATEGORÍA: QUINCEAÑERAS
│   ├── Britney/                 # ⭐ EVENTO PRINCIPAL ACTIVO (XV Britney)
│   │   ├── index.html           # Invitación con Sello Real 3D, música, pase VIP, itinerario y RSVP
│   │   ├── admin.html           # Generador de pases personalizados para WhatsApp
│   │   ├── confirmados.html     # Dashboard en tiempo real conectado a Google Sheets
│   │   ├── codigo_google_sheets.js # Código listo para Apps Script
│   │   ├── musica.mp3           # Canción de fondo
│   │   └── fotos/               # Galería fotográfica (portada, foto1 a foto7)
│   └── Plantilla/               # 📋 Plantilla lista para duplicar para nuevas quinceañeras
│
├── Bodas/                       # 💍 CATEGORÍA: BODAS & MATRIMONIOS
│   └── Plantilla/               # 📋 Plantilla base para duplicar para nuevos clientes de bodas
│
└── Fiestas/                     # 🎉 CATEGORÍA: CUMPLEAÑOS & EVENTOS SOCIALES
    └── Plantilla/               # 📋 Plantilla base para duplicar para fiestas y aniversarios
```

---

## 🚀 Enlaces Directos del Evento (XV Britney)

- **Invitación Digital de Gala:**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV/Britney/`
- **Pase Personalizado VIP (Ejemplo con Familia y Lugares):**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV/Britney/?n=Morales&p=3`
- **Generador de Pases & Enlaces WhatsApp:**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV/Britney/admin.html`
- **Dashboard de Confirmados en Vivo:**  
  `https://alvapcompany.github.io/invitaciones_Fiestas/XV/Britney/confirmados.html`

---

## 📝 Guía Paso a Paso: Cómo Agregar un Nuevo Cliente

Para agregar un nuevo cliente en menos de 3 minutos:

1. **Selecciona la categoría adecuada**:
   - Para Quince Años: entra a `XV/`
   - Para Bodas: entra a `Bodas/`
   - Para Fiestas o Cumpleaños: entra a `Fiestas/`

2. **Duplica la carpeta `Plantilla`**:
   - Cámbiale el nombre a la nueva carpeta por el del cliente (ejemplo: `XV/Valeria/` o `Bodas/Carlos_y_Ana/`).

3. **Reemplaza fotos y música**:
   - En la carpeta `fotos/`, guarda las imágenes del cliente.
   - En `musica.mp3`, coloca su canción favorita.

4. **Conecta Google Sheets (Opcional pero Recomendado)**:
   - Crea una hoja de Google Sheets con las columnas: `Familia`, `Pases`, `Confirmado`, `Fecha_Confirmacion`.
   - Ve a **Extensiones > Apps Script** en tu hoja, pega el código de `codigo_google_sheets.js`.
   - Haz clic en **Implementar > Nueva implementación**, selecciona **Aplicación Web**, elige acceso para **Cualquiera**, y copia la URL terminada en `/exec`.

5. **Actualiza las variables de configuración**:
   - Abre `index.html` del nuevo cliente y edita el bloque superior:
     ```javascript
     const CONFIG_EVENTO = {
         GOOGLE_SHEETS_URL: 'TU_NUEVA_URL_APPS_SCRIPT_AQUI',
         WHATSAPP_PHONE: '52XXXXXXXXXX',
         NOMBRE_FESTEJADA: 'Nombre del Cliente',
         FECHA_EVENTO: new Date(2026, 11, 20, 18, 0, 0)
     };
     ```

6. **Sube los cambios a GitHub**:
   ```bash
   git add .
   git commit -m "feat: agregar invitacion de nuevo cliente"
   git push
   ```
   ¡Tu cliente tendrá su invitación lista en segundos en `https://alvapcompany.github.io/invitaciones_Fiestas/Categoria/Nombre_Cliente/`!
