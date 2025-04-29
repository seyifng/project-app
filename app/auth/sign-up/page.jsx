'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'client',
    email: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Redirect on success
      router.push('/dashboard');
    } catch (err) {
      setError('Server error');
      console.error(err);
    }
  }; // << this was missing before

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-2 border" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" required />
        <select name="role" onChange={handleChange} className="w-full p-2 border" required>
          <option value="client">Client</option>
          <option value="provider">Provider</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Account</button>
      </form>
    </div>
  );
};

export default SignUpPage;
