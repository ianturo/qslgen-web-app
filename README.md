# QSL Web Generator

[![Live demo](https://img.shields.io/badge/demo-qslgen.hk4q.net-2ea44f)](https://qslgen.hk4q.net/)
[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

**English** · [Español](README.es.md)

Free web app that turns your ADIF log into custom electronic QSL cards, looks up names and emails on QRZ.com, and sends them in bulk via Gmail. Your data stays in your browser.

**Try it now: [qslgen.hk4q.net](https://qslgen.hk4q.net/)** — no account, no install.

<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://assets.zyrosite.com/TbT7kBXb1ry5aaj6/screen-dark-LV9AGFwHCyxBzzNs.png">
  <img src="https://assets.zyrosite.com/TbT7kBXb1ry5aaj6/screen-light-XKk5kPE6aGytmNwP.png" alt="Turn your ADIF log into customized electronic QSL cards, enrich contacts with QRZ.com and send them by Gmail." >
</picture>

## Why this exists

As an amateur radio operator, I often activate islands (IOTA) and parks (POTA), and I like to send QSL cards that show those places. The free options I found made it hard to send cards in bulk, so, with some help from AI, I built the tool I had long wished existed.

The interface and the user manual are available in **English and Spanish**, with light and dark themes.

## Features

- **Callsign-based access** — no account or password. The callsign only separates each operator's data within the same browser; it is not a security barrier.
- **ADIF import/export** — load `.adi` / `.adif` files. Names (`NAME` / `NAME_INTL`) and emails (`EMAIL`) from the log are reused, and `MY_*` fields prefill your station data.
- **Manual QSO editing** — add or edit contacts directly in the app.
- **QSL designer** — 1240 × 797 px card with background image, predefined logos, personal icons, free text and a configurable QSO table. Every element can be dragged, resized, hidden and restyled.
- **Template variables** — `{MY_CALL}`, `{CALL}`, `{NAME}`, `{DATE}`, `{BAND}`, `{MODE}`, `{QSOS}` and more, usable in card text and in the email subject and body.
- **QRZ.com lookup** — fills in names and public emails using a QRZ XML session key, with caching and a fallback for portable callsigns.
- **Delivery by Gmail** — sends each card as a JPG/PNG attachment through Gmail SMTP with an app password. Can group contacts by callsign and skip those already sent.
- **Downloads** — single card, copy to clipboard, or a ZIP with all selected cards.
- **Settings portability** — export/import a `QSL_config_<CALLSIGN>_<date>.json` file to move your setup to another computer.

> **Note:** these cards are a courtesy confirmation sent by email. They are not valid confirmations for awards; use LoTW, eQSL.cc (AG) or QRZ Logbook for that.

## How it works

1. **Sign in** with your callsign.
2. **Load your ADIF** exported from your logging program (Log4OM, N1MM, WSJT-X, HRD, QRZ Logbook, etc.).
3. **Fill in your station**: callsign, name, QTH, country, grid, CQ/ITU zones, rig, antenna, power, date format and extra text. Empty values are removed from the card instead of leaving orphan labels.
4. **Design the QSL**: background, logos, icons, text and table columns.
5. **Look up the selected contacts on QRZ** (paste a session key from [xml.qrz.com/xcheck](https://xml.qrz.com/xcheck)). Contacts whose ADIF record already has an email are skipped.
6. **Send by Gmail or download** the cards, one by one or as a ZIP.

The full user guide, with every option and a troubleshooting table, is in [`public/manual.html`](public/manual.html) and opens from the **📖 User Manual** link in the app.

## Template variables

Write variables between braces; they are replaced for each contact.

| Variable | Content |
|---|---|
| `{MY_CALL}` `{MY_NAME}` | Your callsign and name |
| `{MY_QTH}` `{MY_COUNTRY}` `{MY_GRID}` | Your city, country and grid |
| `{CQ}` `{ITU}` | Your CQ and ITU zones |
| `{RIG}` `{ANTENNA}` `{POWER}` | Your rig, antenna and power |
| `{EXTRA}` | Extra text from *My station* |
| `{CALL}` | Correspondent's callsign |
| `{NAME}` `{FULL_NAME}` | Correspondent's first or full name (from QRZ or ADIF; falls back to the callsign) |
| `{DATE}` `{TIME}` | QSO date (chosen format) and UTC time |
| `{FREQ}` `{BAND}` `{MODE}` | Frequency in MHz, band and mode |
| `{RST_SENT}` `{RST_RCVD}` | Reports sent and received |
| `{QTH}` `{GRID}` `{COUNTRY}` | Correspondent's location |
| `{QSOS}` | List of the contacts included in the email, one per line |

Each variable also has a Spanish alias, so designs saved in either language keep working: `{MI_INDICATIVO}`, `{MI_NOMBRE}`, `{MI_QTH}`, `{MI_PAIS}`, `{MI_GRID}`, `{ANTENA}`, `{POTENCIA}`, `{NOMBRE}`, `{NOMBRE_COMPLETO}`, `{FECHA}`, `{HORA}`, `{BANDA}`, `{MODO}`, `{RST_ENV}`, `{RST_REC}`, `{PAIS}`.

In card text, segments separated by `·`, `|` or `,` whose variables are empty are dropped, along with lines left empty.

## Privacy & security

- **No server-side storage.** The server keeps no database, logs or credentials. Your log, designs and settings live in your browser's storage.
- **Credentials pass through the server, but are not stored.** Sending email over SMTP and querying QRZ both happen on the server, so your Gmail app password and QRZ session key travel in each request body and are discarded after it. If you prefer not to trust the hosted instance, [run your own](#self-hosting).
- **Remembered credentials** are saved in the browser only when you tick the corresponding **Remember** box.

> [!WARNING]
> The settings file (`QSL_config_...json`) is not encrypted. If you chose to remember credentials, they are included in it, so store it safely.

## Known limitations

- **Gmail limits:** personal accounts can send roughly 500 messages a day. The app pauses 1.5 s between emails; send large batches in groups.
- **QRZ session keys expire.** Generate a new one if you see *Session Timeout* or *Invalid session key*.
- **Clipboard copy** requires `localhost` or HTTPS; otherwise use *Download this QSL*.
- **Backgrounds and icons** live in browser storage. Very large images may not fit and will need re-uploading after a reload.
- **Changing browser or computer** means your data is not there; use *Save settings* / *Load settings* to move it.

## Self-hosting

### Requirements

- Node.js **20.9 or newer**
- *(Optional)* A QRZ.com subscription that includes **XML Logbook Data**, for name and email lookups
- A Gmail account with 2-Step Verification and an **app password**, to send email

### Run locally

```bash
git clone https://github.com/ianturo/qslgen-web-app.git
cd qslgen-web-app
npm install
npm run dev
```

Open [http://localhost:8000](http://localhost:8000).

| Script | Description |
|---|---|
| `npm run dev` | Development server on port 8000 |
| `npm run build` | Production build |
| `npm start` | Start the production server |

No environment variables are required. Credentials are entered in the interface.

### Deploying

Any host that runs a Node.js server works (a VPS, Docker, Railway, Render, etc.). `/api/send` accepts request bodies up to 25 MB because cards travel as base64 attachments. Serverless platforms often cap request bodies far below that (Vercel functions, for example), so large cards or grouped emails may fail there.

## Architecture

The interface is static HTML/CSS/JS in `public/`. Next.js serves those files and exposes four stateless API routes; it does not render React components for the UI.

| Route | Method | Purpose |
|---|---|---|
| `/api/qrz` | `POST` | Proxies a callsign query to `xmldata.qrz.com` with the user's session key |
| `/api/verify` | `POST` | Checks Gmail credentials against `smtp.gmail.com:465` |
| `/api/send` | `POST` | Sends one QSL email with base64 attachments (body limit 25 MB) |
| `/api/logos` | `GET` | Lists the images in `public/logos` for the logo grid |

```bash
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
next.config.mjs       Rewrites "/" to index.html, disables the powered-by header
```

**Tech stack:** [Next.js](https://nextjs.org/) 16 (App Router, Webpack) · [Nodemailer](https://nodemailer.com/) for Gmail SMTP · static front end in `public/`.

## Contributing

Bug reports, ideas and pull requests are welcome.

- **Found a bug or have an idea?** [Open an issue](https://github.com/ianturo/qslgen-web-app/issues).
- **Want to code?** Fork the repo, create a branch, and open a pull request describing what you changed and why.

## License & credits

Released under the [GPL-3.0 license](LICENSE).

The predefined logos in `public/logos` belong to their respective owners.
