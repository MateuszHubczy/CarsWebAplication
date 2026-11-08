import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';


type CarCardProps = {
    car: Car;
    onDelete: (id: string) => void;
};

export default function CarCard({ car, onDelete }: CarCardProps) {
    const isFavorite = useCarUiStore(
        (state) => state.favoriteCarIds.includes(car.id)
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
                        onClick={() => toggleFavorite(car.id)}
                    >
                        {isFavorite ? 'Ulubiony' : '+ Ulubione'}
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(car.id)}
                        className="danger-button"
                    >
                        Usuń
                     </button>
                </div>
            </div>
        </div>
    );
}