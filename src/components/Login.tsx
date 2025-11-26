import { useState } from 'react';
import { User } from '../utils/mockData';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersJson = localStorage.getItem('afli_users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    const user = users.find(
      (u: User) => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg mb-4">
            <h1 className="text-3xl">AFLI</h1>
            <p className="text-sm">Ageas Federal Life Insurance</p>
          </div>
          <h2 className="text-2xl">Agent Onboarding System</h2>
          <p className="text-gray-600">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-sm text-blue-600 hover:underline w-full text-center"
          >
            {showCredentials ? 'Hide' : 'Show'} Demo Credentials
          </button>
          
          {showCredentials && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm space-y-2">
              <div className="border-b border-blue-200 pb-2">
                <p><strong>Admin:</strong></p>
                <p>Username: admin | Password: admin123</p>
              </div>
              <div className="border-b border-blue-200 pb-2">
                <p><strong>Manager:</strong></p>
                <p>Username: manager | Password: manager123</p>
              </div>
              <div>
                <p><strong>Operator:</strong></p>
                <p>Username: operator | Password: operator123</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 Ageas Federal Life Insurance</p>
          <p>Secure Agent Onboarding Platform</p>
        </div>
      </div>
    </div>
  );
}
