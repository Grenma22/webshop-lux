import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-not-found">
      <div className="not-found-glow"></div>
      <div className="not-found-content">
        <h1 className="not-found-code text-gradient">404</h1>
        <h2 className="not-found-title">Seite nicht gefunden</h2>
        <p className="not-found-text">
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
        </p>
        <Link to="/" className="btn-primary not-found-btn">
          <ArrowLeft size={20} /> Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
