# QSL Web Generator
As an amateur radio operator, I frequently activate sites such as islands or POTA (Parks on the Air) locations, and I like to send QSL cards featuring these beautiful spots. However, the available free options made it difficult to send them in bulk, so—with the help of some AI—I set out to develop exactly what I needed.

This Web Aapplication that turns your ADIF log into customized electronic QSL cards, looks up each correspondent's name and email on QRZ.com, and sends the cards by Gmail.

The interface and the manual are available in **English and Spanish**, with light and dark themes. All user data stays in the browser; the server keeps no database, logs or stored credentials.

Test in <https://qslgen.hk4q.net/>

## Features

- **Callsign-based access** — no account or password; the callsign only separates each operator's data in the same browser.
- **ADIF import** — load `.adi` / `.adif` files; names (`NAME` / `NAME_INTL`) and emails (`EMAIL`) from the log are reused, and `MY_*` fields prefill the station data.
- **QSL designer** — 1240 × 797 px card with background image, predefined logos, personal icons, free texts and a configurable QSO table. Elements can be dragged, resized, hidden and restyled.
- **Template variables** — `{CALL}`, `{NOMBRE}`, `{FECHA}`, `{BANDA}`, `{MODO}`, `{QSOS}` and many more, usable in card texts and in the email subject/message.
- **QRZ.com lookup** — fills in names and public emails using a QRZ XML session key, with caching and portable-callsign fallback.
- **Delivery by Gmail** — sends each card as a JPG/PNG attachment through Gmail SMTP with an app password, optionally grouping contacts by callsign and skipping already-sent ones.
- **Downloads** — single-card download, copy to clipboard, or a ZIP with all selected cards.
- **Settings portability** — export/import a `QSL_config_<CALLSIGN>_<date>.json` file to move an operator's setup to another computer.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router, Webpack)
- React 19
- [Nodemailer](https://nodemailer.com/) for Gmail SMTP delivery
- Static HTML/CSS/JS front end in `public/` (`index.html` for the generator, `manual.html` for the user manual)

## Requirements

- Node.js **20.9 or newer**
- A QRZ.com account with a subscription that includes **XML Logbook Data** (optional; needed only for QRZ lookups)
- A Gmail account with 2-Step Verification and an **app password** (needed to send email)

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:8000>.

### Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Development server on port 8000 |
| `npm run build` | Production build |
| `npm start` | Start the production server |

No environment variables are required. The Gmail app password and the QRZ session key are entered by the user in the interface and are only persisted in the browser when the corresponding **Remember** boxes are ticked.

## Workflow

1. **Sign in** with your callsign.
2. **Load the ADIF** file exported from your logging program (Log4OM, N1MM, WSJT-X, HRD, QRZ Logbook, etc.).
3. **Fill in your station**: callsign, name, QTH, country, grid, CQ/ITU zones, rig, antenna, power, date format and extra text. Empty values are removed automatically from the card instead of leaving orphan labels.
4. **Design the QSL**: background, logos, icons, texts and table columns.
5. **Look up the selected contacts on QRZ** (paste the session key from <https://xml.qrz.com/xcheck>). Contacts whose ADIF record already has an email are skipped.
6. **Send by Gmail or download** the cards, individually or as a ZIP.

## Variables

Variables are written between braces and replaced per contact. Names are the same in both languages, so saved designs keep working.

| Variable | Content |
| -------- | ------- |
| `{MI_INDICATIVO}` `{MI_NOMBRE}` | Your callsign and name |
| `{MI_QTH}` `{MI_PAIS}` `{MI_GRID}` | Your city, country and grid |
| `{CQ}` `{ITU}` | Your CQ and ITU zones |
| `{RIG}` `{ANTENA}` `{POTENCIA}` | Your equipment, antenna and power |
| `{EXTRA}` | Extra text from *My station* |
| `{CALL}` | Correspondent's callsign |
| `{NOMBRE}` `{NOMBRE_COMPLETO}` | Correspondent's first or full name (from QRZ or ADIF; falls back to the callsign) |
| `{FECHA}` `{HORA}` | QSO date (chosen format) and UTC time |
| `{FREQ}` `{BANDA}` `{MODO}` | Frequency in MHz, band and mode |
| `{RST_ENV}` `{RST_REC}` | Reports sent and received |
| `{QTH}` `{GRID}` `{PAIS}` | Correspondent's location |
| `{QSOS}` | List of the contacts included in the email, one per line |

In card texts, segments separated by `·`, `|` or `,` whose variables are empty are dropped, along with lines left empty.

## API routes

| Route | Method | Purpose |
| ----- | ------ | ------- |
| `/api/qrz` | `POST` | Proxies a call-URL query to `xmldata.qrz.com` using the user's session key |
| `/api/verify` | `POST` | Verifies Gmail credentials against `smtp.gmail.com:465` |
| `/api/send` | `POST` | Sends one QSL email with base64 attachments (request body limited to 25 MB) |
| `/api/logos` | `GET` | Lists image files under `public/logos` for the logo grid |

These endpoints are stateless: credentials are passed in the request body and never stored server-side.

## Project structure

```text
app/
  layout.js           Root layout required by Next.js
  api/
    logos/route.js    Lists available logo images
    qrz/route.js      QRZ.com XML proxy
    send/route.js     Gmail delivery endpoint
    verify/route.js   Gmail credential check
lib/
  mail.js             SMTP transport, JSON helpers and error mapping
public/
  index.html          Generator UI
  manual.html         Bilingual user manual
  post-card.png       App logo
  logos/              Predefined logos shown in the designer
next.config.mjs       Rewrites "/" to index.html, no powered-by header
```

## Practical notes

- **Gmail limits:** personal accounts can send roughly 500 messages a day; the app pauses 1.5 s between emails, so send large batches in groups.
- **QRZ session keys expire**; generate a new one if you see *Session Timeout* or *Invalid session key*. Keys travel only from the browser to the QRZ endpoint and are never stored on the server.
- **Clipboard copy** requires `localhost` or HTTPS; otherwise use *Download this QSL*.
- **Backgrounds and icons** live in browser storage. Very large background images may not fit and will need re-uploading after reload.
- **Changing browsers or computers** means the data is not there; use *Save settings* / *Load settings* to transfer it. The file is unencrypted, so only include credentials if it is stored safely.

## Documentation

The full user guide, covering every screen and the troubleshooting table, is in [public/manual.html](public/manual.html) and is also reachable from the generator through the **📖 Manual de usuario** link.
