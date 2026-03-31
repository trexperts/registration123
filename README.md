# Registration123 — React + Vite Project

Event registration landing page built with React, Vite, and React Router.

## 📁 Project Structure

```
registration123/
├── index.html
├── vite.config.js
├── package.json
├── .env.example          ← copy to .env and fill in values
└── src/
    ├── main.jsx          ← app entry point
    ├── App.jsx           ← routes
    ├── styles/
    │   └── global.css    ← CSS variables, shared styles
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Navbar.module.css
    │   ├── Footer.jsx
    │   └── Footer.module.css
    ├── pages/
    │   ├── Home.jsx          ← landing page
    │   ├── Home.module.css
    │   ├── Register.jsx      ← registration form page
    │   ├── Register.module.css
    │   ├── Contact.jsx       ← contact page
    │   └── Contact.module.css
    └── api/
        ├── register.js   ← registration form handler (connect your backend here)
        └── contact.js    ← contact form handler (EmailJS / Formspree / custom)
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production
```bash
npm run build
```

## 🔌 Connecting a Real Backend

### Registration Form (`src/api/register.js`)
Uncomment **Option A** and set `VITE_API_URL` in your `.env`:
```
VITE_API_URL=https://api.yoursite.com
```
Your endpoint should accept a `POST` to `/api/registrations` with JSON body.

### Contact Form (`src/api/contact.js`)
Choose one:
- **EmailJS** (no backend needed) — Option A in the file
- **Formspree** (no backend needed) — Option B in the file
- **Custom API** — follow the same pattern as the registration handler

Copy `.env.example` to `.env` and fill in the relevant keys.

## 🎨 Customizing

- **Colors / fonts**: edit `src/styles/global.css` CSS variables
- **Event details**: update `src/pages/Register.jsx` (event name, date, ticket types)
- **Navigation links**: update `src/components/Navbar.jsx`
