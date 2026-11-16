
import {
    useState,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react';

import {
    Link,
    useNavigate,
} from 'react-router';

import {
    register,
} from '../services/authService';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [userName, setUserName] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [error, setError] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleUserNameChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setUserName(event.target.value);
    }

    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setConfirmPassword(event.target.value);
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Hasła nie są identyczne.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setMessage(null);

            const result = await register({
                userName,
                email,
                password,
            });

            setMessage(result);
        }
        catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError(
                    'Nie udało się zarejestrować konta.',
                );
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Rejestracja</h1>

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
                        Nazwa użytkownika
                        <input
                            type="text"
                            value={userName}
                            onChange={handleUserNameChange}
                            required
                            autoComplete="username"
                        />
                    </label>

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

                    <label>
                        Hasło
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                    </label>

                    <label>
                        Powtórz hasło
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            autoComplete="new-password"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Rejestrowanie...'
                            : 'Zarejestruj się'}
                    </button>
                </form>
            )}

            {message && (
                <button
                    type="button"
                    onClick={() => navigate('account/login')}
                >
                    Przejdź do logowania
                </button>
            )}
        </section>
    );
}
