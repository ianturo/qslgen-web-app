// Requerido por Next.js; las páginas reales (index.html / manual.html) se sirven tal cual desde route handlers.
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}