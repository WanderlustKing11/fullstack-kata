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
            <form onSubmit={handleSubmit} className='space-y-4 bg-white shadow p-6 rounded w-full max-w-md mx-auto'>
                <label className='block font-medium mb-1'>
                    Name:
                    <input  
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className='w-full border border-gray-300 rounded px-3 py-2'
                    />
                </label>

                <label className='block font-medium mb-1'>
                    Email:
                    <input  
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className='w-full border border-gray-300 rounded px-3 py-2'
                    />
                </label>

                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50'
                
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>

            {errorMessage && <p className='text-red-600 text-center mt-2'>{errorMessage}</p>}
            {successMessage && <p className='text-green-600 text-center mt-2'>{successMessage}</p>}

            <hr className='my-6' />

            <h2 className='text-xl font-bold text-center mb-2'>Users</h2>
            <ul className='space-y-2 max-w-md mx-auto'>
                {users.map(user => (
                    <li key={user.id} className='border-b pb-1 text-center'>
                        <span className='font-medium'>{user.name}</span> ({user.email})
                    </li>
                ))}
            </ul>
        </>
    )
}

export default UserForm;