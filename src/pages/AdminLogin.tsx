import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 texture-overlay">
      <div className="max-w-md w-full space-y-8 bg-cream p-8 md:p-10 border border-sage/20 relative z-10">
        <div>
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-olive/10">
            <Lock className="h-6 w-6 text-olive" />
          </div>
          <h2 className="mt-6 text-center font-serif text-3xl uppercase tracking-widest text-ink font-light">
            Admin Access
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-sage/40 placeholder-ink/40 text-ink bg-transparent focus:outline-none focus:ring-olive focus:border-olive sm:text-sm font-sans"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-sans text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-serif uppercase tracking-widest text-cream bg-ink hover:bg-olive focus:outline-none transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
