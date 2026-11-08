import { useNavigate } from 'react-router';
import CarForm from '../components/CarForm';
import { createCar } from '../services/carService';
import type { NewCar } from '../models/Car';
import { Link } from 'react-router';

export default function CreateCarPage() {
    const navigate = useNavigate();

    async function handleCreate(car: NewCar) {
        const createdCar = await createCar(car);

        navigate(`/cars/${createdCar.id}`);
    }

    return (
        <div className="page">
            <h1>Dodaj nowy samochód</h1>

            <Link to="/cars" className="button">
                Powróć
            </Link>

            <CarForm
                onSave={handleCreate}
                submitLabel="Dodaj samochód"
            />
        </div>
    );
}
