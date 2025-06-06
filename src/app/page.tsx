import UserForm from '@/components/UserForm';

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-100 text-black p-6'>

        <h1 className='text-2xl font-bold text-center mb-6'>Submit a New User</h1>
        <UserForm />

    </main>
  )
}