import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/auth/signup/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            router.push('/'); // Redirect to home or login page after successful signup
        } else {
            const data = await response.json();
            setError(data.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold">Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Sign Up
            </button>
        </form>
    );
};

export default SignupForm;