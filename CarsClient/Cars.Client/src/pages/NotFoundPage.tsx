
import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <div className="page">
            <h1>404 – Nie znaleziono strony</h1>

            <p>
                Podany adres nie istnieje.
            </p>

            <Link to="/" className="button">
                Wróć na stronę główną
            </Link>
        </div>
    );
}
