'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Form() {  // Should we use an arrow function here instead?
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // I forget, what is this preventDefault for?

        try {
            const response = await axios.post('/api/submit', {
                name,
                email
            });

            console.log('✅ Success:', response.data);
            setName('');
            setEmail('');
        } catch (error: any) {
            console.error('❌ Error submitting form:', error.response?.data || error.message);
        }
    }

    return (
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
    )
}