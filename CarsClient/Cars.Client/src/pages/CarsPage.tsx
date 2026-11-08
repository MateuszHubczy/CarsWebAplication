import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import CarCard from '../components/CarCard';
import axios from 'axios';
import { useCarUiStore } from '../store/useCarUiStore';


export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const searchTerm = useCarUiStore( (state) => state.searchTerm );
    const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
    const showFavoritesOnly = useCarUiStore( (state) => state.showFavoritesOnly );
    const setShowFavoritesOnly = useCarUiStore( (state) => state.setShowFavoritesOnly );
    const favoriteCarIds = useCarUiStore( (state) => state.favoriteCarIds );

    const normalizedSearch = searchTerm.trim().toLowerCase();
    
    const visibleCars =
        cars.filter((car) => {
            const matchesSearch =
                car.brand
                    .toLowerCase()
                    .includes(normalizedSearch)
                ||
                car.model
                    .toLowerCase()
                    .includes(normalizedSearch);
    
            const matchesFavorite =
                !showFavoritesOnly
                ||
                favoriteCarIds.includes(
                    car.id,
                );
    
            return (
                matchesSearch
                &&
                matchesFavorite
            );
        });

    const removeFavorite =
        useCarUiStore(
            (state) =>
                state.removeFavorite,
        );



    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                setError(null);

                const data = await getCars(controller.signal);
                setCars(data);
            } catch (caughtError) {
                if (axios.isCancel(caughtError)) {
                    return;
                }
                
                if (caughtError instanceof Error) {
                    setError(caughtError.message);
                }
                else {
                    setError(
                        `Wystapil nieznany blad.`,
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCars();

        return () => controller.abort();
    }, []);

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            'Czy na pewno chcesz usunąć ten samochód?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCar(id);

            removeFavorite(id);

            setCars(
                (currentCars) =>
                    currentCars.filter( (car) => car.id !== id)
            );

        } catch {
            setError('Nie udało się usunąć samochodu.');
        }
    }

    if (loading) {
        return <p>Ładowanie samochodów...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="page">
            <h1>Lista samochodów</h1>

            <Link to="/cars/new" className="button">
                Dodaj samochód
            </Link>

            <div className="cars-toolbar">
                <input
                    type="search"
                    placeholder="Szukaj po marce lub modelu..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(
                            event.target.value,
                        )
                    }
                />

                <label className="favorite-filter">
                    <input
                        type="checkbox"
                        checked={
                            showFavoritesOnly
                        }
                        onChange={(event) =>
                            setShowFavoritesOnly(
                                event.target.checked,
                            )
                        }
                    />

                    Tylko ulubione
                </label>
            </div>

            {cars.length === 0 ? (
                <p>Brak samochodów w bazie danych.</p>
            ) : (
                <div className="car-list">
                    {visibleCars.map(car => (
                        <CarCard
                            key={car.id}
                            car={car}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
