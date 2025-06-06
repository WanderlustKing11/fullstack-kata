'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number 
    name: string
    email: string
}

export default function Form() {  // Should we use an arrow function here instead?
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState<User[]>([]);

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
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // I forget, what is this preventDefault for?

        try {
            await axios.post('/api/submit', { name, email });
            setName('');
            setEmail('');
            fetchUsers();
        } catch (error: any) {
            console.error('❌ Error submitting form:', error.response?.data || error.message);
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

                <button type="submit">Submit</button>
            </form>

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