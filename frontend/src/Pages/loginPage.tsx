import React, { useState } from 'react';
import { TbBoxModel } from 'react-icons/tb';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 max-w-lg w-full flex flex-col items-center relative">
        {/* Theme Toggle Button */}
        <div className="self-end mb-4">
          <ThemeToggle />
        </div>

        {/* Logo or Icon */}
        <TbBoxModel className="text-6xl dark:text-white" aria-hidden="true" />
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          Welcome to Production Optimiser 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Please sign in to your account and start the adventure
        </p>

        <form className="w-full space-y-4 font-mono" onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="email" 
              className="block text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-4 top-3 cursor-pointer"
                onClick={togglePasswordVisibility}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    togglePasswordVisibility();
                  }
                }}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label 
              htmlFor="remember" 
              className="flex items-center cursor-pointer"
            >
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-500 dark:text-indigo-400"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Remember me
              </span>
            </label>
            <a
              href="/forgot-password"
              className="text-indigo-500 hover:underline dark:text-indigo-400"
              aria-label="Reset your password"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 dark:bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Powered by Section */}
        <div className="mt-4 text-gray-500 dark:text-gray-300 text-sm">
          Powered by{' '}
          <span className="text-indigo-500 dark:text-indigo-400 font-semibold">
            MITC
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
