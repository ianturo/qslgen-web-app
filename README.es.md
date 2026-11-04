# QSL Web Generator

[![Demo en vivo](https://img.shields.io/badge/demo-qslgen.hk4q.net-2ea44f)](https://qslgen.hk4q.net/)
[![Licencia: GPL-3.0](https://img.shields.io/badge/licencia-GPL--3.0-blue)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

[English](README.md) · **Español**

Aplicación web gratuita que convierte tu log ADIF en tarjetas QSL electrónicas personalizadas, busca nombres y correos en QRZ.com y las envía de forma masiva por Gmail. Tus datos se quedan en tu navegador.

**Pruébala ya: [qslgen.hk4q.net](https://qslgen.hk4q.net/)** — sin cuenta y sin instalar nada.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://qslgen.hk4q.net/screen-dark.png">
  <img src="https://qslgen.hk4q.net/screen-light.png" alt="Turn your ADIF log into customized electronic QSL cards, enrich contacts with QRZ.com and send them by Gmail." width="900">
</picture>

## Por qué existe

Como radioaficionado, activo con frecuencia islas (IOTA) y parques (POTA), y me gusta enviar QSL que muestren esos lugares. Las opciones gratuitas que encontré dificultaban el envío masivo, así que, con algo de ayuda de la IA, construí la herramienta que llevaba tiempo deseando.

La interfaz y el manual de usuario están en **inglés y español**, con temas claro y oscuro.

## Funciones

- **Acceso por indicativo** — sin cuenta ni contraseña. El indicativo solo separa los datos de cada operador dentro del mismo navegador; no es una barrera de seguridad.
- **Importación/exportación ADIF** — carga archivos `.adi` / `.adif`. Se reutilizan los nombres (`NAME` / `NAME_INTL`) y correos (`EMAIL`) del log, y los campos `MY_*` prellenan los datos de tu estación.
- **Edición manual de QSOs** — agrega o edita contactos directamente en la app.
- **Diseñador de QSL** — tarjeta de 1240 × 797 px con imagen de fondo, logos predefinidos, iconos propios, textos libres y una tabla de QSOs configurable. Cada elemento se puede arrastrar, redimensionar, ocultar y cambiar de estilo.
- **Variables de plantilla** — `{MI_INDICATIVO}`, `{CALL}`, `{NOMBRE}`, `{FECHA}`, `{BANDA}`, `{MODO}`, `{QSOS}` y más, utilizables en los textos de la tarjeta y en el asunto y cuerpo del correo.
- **Búsqueda en QRZ.com** — completa nombres y correos públicos con una clave de sesión XML de QRZ, con caché y respaldo para indicativos portables.
- **Envío por Gmail** — envía cada tarjeta como adjunto JPG/PNG por SMTP de Gmail con una contraseña de aplicación. Puede agrupar contactos por indicativo y omitir los ya enviados.
- **Descargas** — tarjeta individual, copia al portapapeles o un ZIP con todas las seleccionadas.
- **Configuración portable** — exporta/importa un archivo `QSL_config_<INDICATIVO>_<fecha>.json` para llevar tu configuración a otro computador.

> **Nota:** estas tarjetas son una confirmación de cortesía enviada por correo. No son confirmaciones válidas para diplomas; para eso usa LoTW, eQSL.cc (AG) o QRZ Logbook.

## Cómo funciona

1. **Entra** con tu indicativo.
2. **Carga tu ADIF** exportado desde tu programa de log (Log4OM, N1MM, WSJT-X, HRD, QRZ Logbook, etc.).
3. **Completa tu estación**: indicativo, nombre, QTH, país, grid, zonas CQ/ITU, equipo, antena, potencia, formato de fecha y texto extra. Los valores vacíos se eliminan de la tarjeta en lugar de dejar etiquetas huérfanas.
4. **Diseña la QSL**: fondo, logos, iconos, textos y columnas de la tabla.
5. **Busca en QRZ los contactos seleccionados** (pega una clave de sesión de [xml.qrz.com/xcheck](https://xml.qrz.com/xcheck)). Se omiten los contactos cuyo registro ADIF ya trae correo.
6. **Envía por Gmail o descarga** las tarjetas, una a una o en un ZIP.

La guía de usuario completa, con todas las opciones y una tabla de solución de problemas, está en [`public/manual.html`](public/manual.html) y se abre desde el enlace **📖 Manual de usuario** de la app.

## Variables de plantilla

Las variables se escriben entre llaves y se reemplazan para cada contacto.

| Variable | Contenido |
|---|---|
| `{MI_INDICATIVO}` `{MI_NOMBRE}` | Tu indicativo y nombre |
| `{MI_QTH}` `{MI_PAIS}` `{MI_GRID}` | Tu ciudad, país y grid |
| `{CQ}` `{ITU}` | Tus zonas CQ e ITU |
| `{RIG}` `{ANTENA}` `{POTENCIA}` | Tu equipo, antena y potencia |
| `{EXTRA}` | Texto extra de *Mi estación* |
| `{CALL}` | Indicativo del corresponsal |
| `{NOMBRE}` `{NOMBRE_COMPLETO}` | Nombre o nombre completo del corresponsal (de QRZ o del ADIF; si falta, usa el indicativo) |
| `{FECHA}` `{HORA}` | Fecha del QSO (en el formato elegido) y hora UTC |
| `{FREQ}` `{BANDA}` `{MODO}` | Frecuencia en MHz, banda y modo |
| `{RST_ENV}` `{RST_REC}` | Reportes enviado y recibido |
| `{QTH}` `{GRID}` `{PAIS}` | Ubicación del corresponsal |
| `{QSOS}` | Lista de los contactos incluidos en el correo, uno por línea |

Cada variable tiene también un alias en inglés, así que los diseños guardados en cualquiera de los dos idiomas siguen funcionando: `{MY_CALL}`, `{MY_NAME}`, `{MY_QTH}`, `{MY_COUNTRY}`, `{MY_GRID}`, `{ANTENNA}`, `{POWER}`, `{NAME}`, `{FULL_NAME}`, `{DATE}`, `{TIME}`, `{BAND}`, `{MODE}`, `{RST_SENT}`, `{RST_RCVD}`, `{COUNTRY}`.

En los textos de la tarjeta, los segmentos separados por `·`, `|` o `,` cuyas variables estén vacías se eliminan, igual que las líneas que queden vacías.

## Privacidad y seguridad

- **Nada se guarda en el servidor.** El servidor no tiene base de datos, registros ni credenciales. Tu log, diseños y configuración viven en el almacenamiento de tu navegador.
- **Las credenciales pasan por el servidor, pero no se guardan.** El envío SMTP y la consulta a QRZ ocurren en el servidor, así que tu contraseña de aplicación de Gmail y tu clave de sesión de QRZ viajan en cada petición y se descartan al terminar. Si prefieres no confiar en la instancia pública, [instala la tuya](#instalación-propia).
- **Las credenciales recordadas** se guardan en el navegador solo si marcas la casilla **Recordar** correspondiente.

> [!WARNING]
> El archivo de configuración (`QSL_config_...json`) no está cifrado. Si elegiste recordar credenciales, van incluidas en él, así que guárdalo en un lugar seguro.

## Limitaciones conocidas

- **Límites de Gmail:** las cuentas personales pueden enviar unos 500 mensajes al día. La app hace una pausa de 1,5 s entre correos; envía los lotes grandes por partes.
- **Las claves de sesión de QRZ caducan.** Genera una nueva si ves *Session Timeout* o *Invalid session key*.
- **Copiar al portapapeles** requiere `localhost` o HTTPS; si no, usa *Descargar esta QSL*.
- **Fondos e iconos** se guardan en el navegador. Las imágenes muy grandes pueden no caber y habrá que volver a cargarlas tras recargar la página.
- **Cambiar de navegador o de computador** significa que tus datos no estarán; usa *Guardar configuración* / *Cargar configuración* para llevarlos.

## Instalación propia

### Requisitos

- Node.js **20.9 o superior**
- *(Opcional)* Una suscripción a QRZ.com que incluya **XML Logbook Data**, para buscar nombres y correos
- Una cuenta de Gmail con verificación en dos pasos y una **contraseña de aplicación**, para enviar correos

### Ejecutar en local

```bash
git clone https://github.com/ianturo/qslgen-web-app.git
cd qslgen-web-app
npm install
npm run dev
```

Abre [http://localhost:8000](http://localhost:8000).

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 8000 |
| `npm run build` | Compilación de producción |
| `npm start` | Inicia el servidor de producción |

No se necesitan variables de entorno. Las credenciales se ingresan en la interfaz.

### Despliegue

Sirve cualquier hosting que ejecute un servidor Node.js (un VPS, Docker, Railway, Render, etc.). `/api/send` acepta peticiones de hasta 25 MB porque las tarjetas viajan como adjuntos en base64. Las plataformas serverless suelen limitar el tamaño de la petición muy por debajo de eso (las funciones de Vercel, por ejemplo), así que las tarjetas grandes o los correos agrupados pueden fallar ahí.

## Arquitectura

La interfaz es HTML/CSS/JS estático en `public/`. Next.js sirve esos archivos y expone cuatro rutas de API sin estado; no renderiza componentes React para la interfaz.

| Ruta | Método | Función |
|---|---|---|
| `/api/qrz` | `POST` | Reenvía la consulta de un indicativo a `xmldata.qrz.com` con la clave de sesión del usuario |
| `/api/verify` | `POST` | Verifica las credenciales de Gmail contra `smtp.gmail.com:465` |
| `/api/send` | `POST` | Envía un correo QSL con adjuntos en base64 (límite de 25 MB) |
| `/api/logos` | `GET` | Lista las imágenes de `public/logos` para la galería de logos |

```
app/
  layout.js           Layout raíz requerido por Next.js
  api/
    logos/route.js    Lista los logos disponibles
    qrz/route.js      Proxy XML de QRZ.com
    send/route.js     Envío por Gmail
    verify/route.js   Verificación de credenciales de Gmail
lib/
  mail.js             Transporte SMTP, utilidades JSON y mapeo de errores
public/
  index.html          Interfaz del generador
  manual.html         Manual de usuario bilingüe
  post-card.png       Logo de la app
  logos/              Logos predefinidos del diseñador
next.config.mjs       Redirige "/" a index.html y desactiva la cabecera powered-by
```

**Tecnologías:** [Next.js](https://nextjs.org/) 16 (App Router, Webpack) · [Nodemailer](https://nodemailer.com/) para SMTP de Gmail · front end estático en `public/`.

## Contribuir

Los reportes de errores, ideas y pull requests son bienvenidos.

- **¿Encontraste un error o tienes una idea?** [Abre un issue](https://github.com/ianturo/qslgen-web-app/issues).
- **¿Quieres programar?** Haz un fork, crea una rama y abre un pull request explicando qué cambiaste y por qué.

## Licencia y créditos

Publicado bajo la [licencia GPL-3.0](LICENSE).

Los logos predefinidos de `public/logos` pertenecen a sus respectivos dueños.