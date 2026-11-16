
import {
    useState,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react';

import {
    Link,
} from 'react-router';

import {
    forgotPassword,
} from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] =
        useState('');

    const [error, setError] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setEmail(event.target.value);
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError(null);
            setMessage(null);

            const result =
                await forgotPassword(email);

            setMessage(result);
        }
        catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError(
                    'Nie udało się wysłać żądania odzyskania hasła.',
                );
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Odzyskiwanie hasła</h1>

            <p>
                Podaj adres e-mail przypisany do
                Twojego konta. Wyślemy na niego
                instrukcje dotyczące zmiany hasła.
            </p>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {message && (
                <p>
                    {message}
                </p>
            )}

            {!message && (
                <form
                    className="car-form"
                    onSubmit={handleSubmit}
                >
                    <label>
                        E-mail
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            autoComplete="email"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Wysyłanie...'
                            : 'Wyślij link do zmiany hasła'}
                    </button>
                </form>
            )}

            <p>
                <Link to="/account/login">
                    Wróć do logowania
                </Link>
            </p>
        </section>
    );
}
