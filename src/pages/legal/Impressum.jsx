export default function Impressum() {
  return (
    <div className="container pt-44 md:pt-48 pb-20 max-w-3xl min-h-screen">
      <h1 className="page-title mb-8 md:mb-12">Impressum</h1>
      <div className="legal-content text-secondary leading-relaxed">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>LUX. Premium Webshop Muster GmbH<br />
        Musterstraße 1<br />
        12345 Musterstadt</p>

        <h3 className="mt-8">Vertreten durch:</h3>
        <p>Max Mustermann (Geschäftsführer)</p>

        <h3 className="mt-8">Kontakt:</h3>
        <p>Telefon: +49 (0) 123 44 55 66<br />
        E-Mail: info@lux-webshop-demo.de</p>

        <h3 className="mt-8">Umsatzsteuer-ID:</h3>
        <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
        DE 999 999 999</p>
        
        <p className="mt-8 text-sm italic">Hinweis: Dies ist ein reines Demo-Projekt. Alle Produkte und Adressen sind fiktiv.</p>
      </div>
    </div>
  );
}
