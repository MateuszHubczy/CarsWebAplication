import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getCarById } from "../services/carService";
import type { Car } from "../models/Car";
import axios from "axios";
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
    const { id } = useParams();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const favoriteCarIds = useCarUiStore( (state) => state.favoriteCarIds );
    const toggleFavorite = useCarUiStore( (state) => state.toggleFavorite );

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        setLoading(true);
        setError(null);
        setCar(null);

        getCarById(id, controller.signal)
            .then((data) => {
                setCar(data);
            })
            .catch((err) => {
                if (
                    axios.isCancel(err) ||
                    err.name === "AbortError" ||
                    controller.signal.aborted
                ) {
                    return;
                }

                setError(err.message || "Wystąpił błąd podczas pobierania samochodu.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [id]);

    if (loading) return <p>Ładowanie samochodu...</p>;
    if (error) return <p>Błąd: {error}</p>;
    if (!car) return <p>Nie znaleziono samochodu.</p>;

    const isFavorite = favoriteCarIds.includes( car.id );

    return (
        <div className="car-details">
            <h1>Szczegóły samochodu</h1>

            <p>Marka: {car.brand}</p>
            <p>Model: {car.model}</p>
            <p>Liczba drzwi: {car.doorsNumber}</p>
            <p>Pojemność bagażnika: {car.luggageCapacity}</p>
            <p>Pojemność silnika: {car.engineCapacity}</p>
            <p>Rodzaj paliwa: {car.fuelType}</p>
            <p>Data produkcji: {car.productionDate}</p>
            <p>Średnie spalanie: {car.averageFuelConsumption}</p>
            <p>Typ nadwozia: {car.bodyType}</p>

            <div>
                <Link to="/cars" className="button">
                    Przejdź do listy samochodów
                </Link>
                
                {"    |    "}   

                <Link to={`/cars/${id}/edit`} className="button">
                    Edytuj samochód
                </Link>

                {"    |    "}   

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
            </div>
        </div>
    );
}
