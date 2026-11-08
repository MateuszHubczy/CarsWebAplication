import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';


export default function RootLayout() {

    const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);

    return (
        <div className="app">
            <header className="header">
                <nav className="navigation">
                    <NavLink to="/">
                        Strona główna
                    </NavLink>

                    <NavLink to="/cars">
                        Samochody
                    </NavLink>
                </nav>

                <span className="favorite-counter">
                    Ulubione: {favoriteCount}
                </span>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
