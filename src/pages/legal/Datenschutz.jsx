export default function Datenschutz() {
  return (
    <div className="container pt-44 md:pt-48 pb-20 max-w-3xl min-h-screen">
      <h1 className="page-title mb-8 md:mb-12">Datenschutzerklärung</h1>
      <div className="legal-content text-secondary leading-relaxed">
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>

        <h3 className="mt-8">2. Datenerfassung auf dieser Website</h3>
        <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Als reines Demo-Projekt werden vom lokalen Server (Vite) jedoch keine Echt-Daten permanent in einer Cloud-Datenbank gespeichert, außer in Ihrem lokalen Browser (Local Storage) für die Warenkorb-Funktion.</p>

        <h3 className="mt-8">3. Local Storage</h3>
        <p>Um den Inhalt Ihres Warenkorbs während der Sitzung und für künftige Besuche zu speichern, nutzen wir die "Local Storage" Technologie Ihres Browsers. Diese Daten verbleiben ausschließlich auf Ihrem Endgerät.</p>
      </div>
    </div>
  );
}
