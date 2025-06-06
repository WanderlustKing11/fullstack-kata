'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { setDefaultResultOrder } from 'dns';

interface User {
    id: number 
    name: string
    email: string
}

const UserForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErroMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.log('❌ Failed to fetch users:', error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErroMessage('');
        setSuccessMessage('');

        // front-end validation
        if (!name.trim() || !email.trim()) {
            setErroMessage('Name and email are required.');
            return
        }

        setIsSubmitting(true);

        try {
            await axios.post('/api/submit', { name, email });
            setName('');
            setEmail('');
            setSuccessMessage('User successfully added!');
            fetchUsers();
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Something went wrong.';
            setErroMessage(msg);
            // console.error('❌ Error submitting form:', error.response?.data || error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input  
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Email:
                    <input  
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>

                <button type="submit">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <hr />

            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </>
    )
}

export default UserForm;