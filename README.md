# Fullstack Kata: Submit Form & Save to DB (Next.js + TypeScript + SQLite + Tailwind)

This Kata is a **daily coding drill** designed to help master:

* Handling user input
* Making `POST`, `GET`, and `DELETE` requests
* Using Prisma with SQLite
* Managing React state
* Client/server interaction in a Next.js app
* Styling with Tailwind CSS

---

## ✅ Prerequisites

* Node.js >= 18
* GitHub account
* SQLite (handled by Prisma, no install needed)

---

## ⚙️ Stage 1: Project Setup

### 1. Create the Next.js App

```bash
npx create-next-app@latest fullstack-kata
```

When prompted:

* ✅ **Use TypeScript**: Yes
* ✅ **Use ESLint**: Yes
* ✅ **Use Tailwind CSS**: Yes
* ✅ **Use src directory**: Yes
* ✅ **Use App Router**: Yes
* ❌ **Use Turbopack**: No
* ❌ **Customize import alias**: No


```bash
cd fullstack-kata
code .
```

### 2. Initial Git Setup

Next.js auto-initializes Git. Make a quick code edit (e.g., `console.log('hello world')`, or change the home page title) and commit:

```bash
git add .
git commit -m "Initial Next.js setup"
```

### 3. Create GitHub Repo and Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/fullstack-kata.git
git branch -M main
git push -u origin main
```

### 4. Clean Up Default Files

Delete these files in `src/app`:

* `page.module.css`
* Optionally remove any placeholder boilerplate in `page.tsx` and `layout.tsx`

In `layout.tsx`, make sure to import the global CSS:

```tsx
import './globals.css'
```

Tailwind automatically added its import to `globals.css`, so **do not manually add** the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

They are already included via:

```css
@import "tailwindcss";
```

### 5. Install Prisma & Axios

```bash
npm install axios prisma @prisma/client
npx prisma init
```

### 6. Configure Prisma to Use SQLite

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

Update `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Then generate the database:

```bash
npx prisma migrate dev --name init
```

### 7. Test the App

```bash
npm run dev
```

Verify `http://localhost:3000` works.

---

## 🧱 Stage 2: Build the Form & POST to API

### 1. Create a form component

File: `src/components/UserForm.tsx`

```tsx
'use client'

import { useState } from 'react'
import axios from 'axios'

const UserForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/submit', { name, email })
      setName('')
      setEmail('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded w-full max-w-md mx-auto">
      <div>
        <label className="block font-medium mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
      >
        Submit
      </button>
    </form>
  )
}

export default UserForm
```

### 2. API Route for POST

**File: `src/app/api/submit/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { name, email } = await req.json()
  const newUser = await prisma.user.create({ data: { name, email } })
  return NextResponse.json(newUser)
}
```

### 3. Use the Form in Your Home Page

**File: `src/app/page.tsx`**

```tsx
import UserForm from '@/components/UserForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Submit a New User</h1>
      <UserForm />
    </main>
  )
}
```

---

## 🔄 Stage 3: GET and Display Users

### 1. Create the GET API Route

**File: `src/app/api/users/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: { id: 'desc' }
    });
    return NextResponse.json(users);
}
```

### 2. Update `UserForm` to Fetch and Show Users

* Add `useEffect()` to fetch users
* Render the user list below the form

---

## ✨ Stage 4: Validation & UX Feedback

Enhance `UserForm.tsx` with:

* `isSubmitting`, `errorMessage`, and `successMessage` states
* Front-end validation
* Feedback messages
* Submit button disable logic

### Example additions:

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  if (!name.trim() || !email.trim()) {
    setErrorMessage('Name and email are required.');
    return;
  }

  setIsSubmitting(true);

  try {
    await axios.post('/api/submit', { name, email });
    setName('');
    setEmail('');
    setSuccessMessage('User successfully added!');
    fetchUsers();
  } catch (error: any) {
    const msg = error.response?.data?.error || 'Something went wrong';
    setErrorMessage(msg);
  } finally {
    setIsSubmitting(false);
  }
}
```

Add messages to JSX:

```tsx
{errorMessage && <p className="text-red-600 text-center mt-2">{errorMessage}</p>}
{successMessage && <p className="text-green-600 text-center mt-2">{successMessage}</p>}
```

---

## 🔐 Stage 5: Backend Duplicate Check

**File: `src/app/api/submit/route.ts`**

Update your route to reject duplicate emails:

```ts
const existingUser = await prisma.user.findUnique({ where: { email } });

if (existingUser) {
  return NextResponse.json(
    { error: 'A user with that email already exists.' },
    { status: 409 }
  );
}
```

Place it before `prisma.user.create()` in the `POST` handler.

---

## 🗑️ Stage 6: Delete Users + Show Totals

### 1. Create DELETE Route

**File: `src/app/api/users/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
```

### 2. Update `UserForm` with Delete Functionality

Add delete handler:

```tsx
const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/api/users/${id}`);
    fetchUsers();
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
  }
}
```

Update user list JSX:

```tsx
<h2 className="text-xl font-bold text-center mb-2">Users ({users.length})</h2>
<ul className="space-y-2 max-w-md mx-auto">
  {users.map(user => (
    <li key={user.id} className="border-b pb-1 flex justify-between items-center">
      <span>{user.name} ({user.email})</span>
      <button
        onClick={() => handleDelete(user.id)}
        className="text-sm text-red-500 hover:underline"
      >
        Delete
      </button>
    </li>
  ))}
</ul>
```

---

## ✅ Final Kata Summary

You now have:

* Create users with a styled React + Tailwind form

* Read all users below the form with live refresh

* Delete users on click (with total-count display)

* Front-end validation and user feedback (loading / error / success)

* Back-end validation that prevents duplicate emails (409 response)

* SQLite + Prisma storage using a clean Next.js API-route pattern

* A repeatable, end-to-end full-stack workflow you can spin up in minutes

Optional next steps listed:

* Add update/edit functionality

* Integrate a validation library (e.g., Zod)

* Swap SQLite for Postgres via Docker for prod-grade practice

* Deploy on Vercel and seed with test data


Happy coding! 💻

