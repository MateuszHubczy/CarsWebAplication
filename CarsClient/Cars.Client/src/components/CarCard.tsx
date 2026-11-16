import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

type CarCardProps = {
    car: Car;
    onDelete: (id: string) => void;
};

export default function CarCard({ car, onDelete }: CarCardProps) {
    const user =
        useAuthStore(
            (state) => state.user,
        );

    const isAdmin =
        user?.roles.includes('Admin')
        ?? false;

    // 1. Zustand zwraca istniejący obiekt ze store.
    const favoriteCarIdsByUser =
        useCarUiStore(
            (state) =>
                state.favoriteCarIdsByUser,
        );
    // 2. Dopiero zwykły kod JS wybiera tablicę użytkownika.
    const favoriteCarIds =
        user
            ? favoriteCarIdsByUser[user.id] ?? []
            : [];
    const isFavorite =
        favoriteCarIds.includes(
            car.id,
        );


    const toggleFavorite = useCarUiStore(
        (state) => state.toggleFavorite
    );

    return (
        <div className="car-card">
            <h3>
                {car.brand} {car.model}
            </h3>

            <div className="actions">
                <div>
                    <Link to={`/cars/${car.id}`} className="button">
                        Szczegóły
                    </Link>

                    <Link to={`/cars/${car.id}/edit`} className="button">
                        Edytuj
                    </Link>
                </div>

                <div>
                    <button
                        type="button"
                        className={
                            isFavorite
                                ? 'favorite-button active-favorite'
                                : 'favorite-button'
                        }
                        onClick={() => { if (user) { toggleFavorite(user.id, car.id); } }}

                    >
                        {isFavorite ? 'Ulubiony' : '+ Ulubione'}
                    </button>

                    {isAdmin ? (
                        <>
                            <button
                                type="button"
                                onClick={() => onDelete(car.id)}
                                className="danger-button"
                            >
                                Usuń
                            </button>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}