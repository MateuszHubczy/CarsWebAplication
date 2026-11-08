import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';
import { Link } from 'react-router';
import axios from 'axios';

export default function EditCarPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            setError('Nie podano identyfikatora samochodu.');
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function loadCar() {
            try {
                setError(null);

                const data = await getCarById(id!, controller.signal);
                setCar(data);
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

        loadCar();

        return () => controller.abort();
    }, [id]);

    async function handleUpdate(updatedCar: NewCar) {
        if (!id) {
            throw new Error('Brak identyfikatora samochodu.');
        }

        await updateCar(id, updatedCar);

        navigate(`/cars/${id}`);
    }

    if (loading) {
        return <p>Ładowanie danych samochodu...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!car) {
        return <p>Nie znaleziono samochodu.</p>;
    }

    return (
        <div className="page">
            <h1>Edytuj samochód</h1>


            <Link to="/cars" className="button">
                Przejdź do listy samochodów
            </Link>

            <CarForm
                initialCar={car}
                onSave={handleUpdate}
                submitLabel="Zapisz zmiany"
            />
        </div>
    );
}
