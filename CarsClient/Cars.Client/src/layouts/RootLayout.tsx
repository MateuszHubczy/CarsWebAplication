import { NavLink, Outlet, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';



export default function RootLayout() {
    const navigate = useNavigate();

    const user =
        useAuthStore(
            (state) => state.user,
        );

    const favoriteCount =
        useCarUiStore(
            (state) =>
                user
                    ? (
                        state.favoriteCarIdsByUser[
                        user.id
                        ] ?? []
                    ).length
                    : 0,
        );

    // Akcja wylogowania z magazynu Zustand.
    const logout =
        useAuthStore(
            (state) => state.logout,
        );

    function handleLogout() {
        // Usuwamy użytkownika ze stanu aplikacji.
        logout();
        // Po wylogowaniu przechodzimy
        // na stronę logowania.
        navigate('/account/login');
    }

    return (
        <div className="app">
            <header className="header">
                <nav className="navigation">
                    <NavLink to="/" className="nav-button">
                        Strona główna
                    </NavLink>

                    {user && (
                        <>
                            <NavLink to="/cars" end>
                                Samochody
                            </NavLink>
                        </>
                    )}

                    {user ? (
                        <>
                            <span className="favorite-counter">
                                Ulubione: {favoriteCount}
                            </span>
                            <span className="user-info">
                                {user.userName}
                                {' ('}
                                {user.roles.join(', ')}
                                {')'}
                            </span>
                            <button
                                type="button"
                                className="nav-button"
                                onClick={handleLogout}
                            >
                                Wyloguj
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="account/login">
                                Logowanie
                            </NavLink>
                            <NavLink to="account/register">
                                Rejestracja
                            </NavLink>
                        </>
                    )}
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
