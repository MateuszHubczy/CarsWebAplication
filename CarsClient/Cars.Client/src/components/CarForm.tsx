
import { useEffect, useState } from 'react';
import type { Car, NewCar } from '../models/Car';

interface CarFormProps {
    initialCar?: Car;
    onSave: (car: NewCar) => Promise<void>;
    submitLabel: string;
}

const emptyCar: NewCar = {
    brand: '',
    model: '',
    doorsNumber: 5,
    luggageCapacity: 0,
    engineCapacity: 0,
    fuelType: 1,
    productionDate: '',
    averageFuelConsumption: 0,
    bodyType: 1
};

export default function CarForm({
    initialCar,
    onSave,
    submitLabel
}: CarFormProps) {
    const [car, setCar] = useState<NewCar>(emptyCar);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialCar) {
            const { id, ...carData } = initialCar;
            setCar(carData);
        }
    }, [initialCar]);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;

        setCar(previous => ({
            ...previous,
            [name]: [
                'doorsNumber',
                'luggageCapacity',
                'engineCapacity',
                'fuelType',
                'averageFuelConsumption',
                'bodyType'
            ].includes(name)
                ? Number(value)
                : value
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSave(car);
        } catch {
            setError('Nie udało się zapisać samochodu.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="car-form">
            <label>
                Marka:
                <input
                    name="brand"
                    value={car.brand}
                    onChange={handleChange}
                    required
                    maxLength={50}
                />
            </label>

            <label>
                Model:
                <input
                    name="model"
                    value={car.model}
                    onChange={handleChange}
                    required
                    maxLength={50}
                />
            </label>

            <label>
                Liczba drzwi:
                <input
                    type="number"
                    name="doorsNumber"
                    value={car.doorsNumber}
                    onChange={handleChange}
                    min="2"
                    max="5"
                    required
                />
            </label>

            <label>
                Pojemność bagażnika (l):
                <input
                    type="number"
                    name="luggageCapacity"
                    value={car.luggageCapacity}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </label>

            <label>
                Pojemność silnika (cm³):
                <input
                    type="number"
                    name="engineCapacity"
                    value={car.engineCapacity}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </label>

            <label>
                Rodzaj paliwa:
                <select
                    name="fuelType"
                    value={car.fuelType}
                    onChange={handleChange}
                >
                    <option value={0}>Benzyna</option>
                    <option value={1}>Diesel</option>
                    <option value={2}>Hybryda</option>
                    <option value={3}>Elektryczny</option>
                    <option value={4}>LPG</option>
                </select>
            </label>

            <label>
                Data produkcji:
                <input
                    type="date"
                    name="productionDate"
                    value={car.productionDate.slice(0, 10)}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Średnie spalanie (l/100 km):
                <input
                    type="number"
                    step="0.1"
                    name="averageFuelConsumption"
                    value={car.averageFuelConsumption}
                    onChange={handleChange}
                    min="0.1"
                    required
                />
            </label>

            <label>
                Typ nadwozia:
                <select
                    name="bodyType"
                    value={car.bodyType}
                    onChange={handleChange}
                >
                    <option value={0}>Hatchback</option>
                    <option value={1}>Sedan</option>
                    <option value={2}>Kombi</option>
                    <option value={3}>SUV</option>
                    <option value={4}>Roadster</option>
                </select>
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={saving}>
                {saving ? 'Zapisywanie...' : submitLabel}
            </button>
        </form>
    );
}
