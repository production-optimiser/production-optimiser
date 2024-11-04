import React, { useState } from 'react';
import { TbBoxModel } from 'react-icons/tb';
import ThemeToggle from '../components/ThemeToggle'; // Assuming you have this component

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 max-w-lg w-full flex flex-col items-center relative">
        {/* Theme Toggle Button */}
        <div className="self-end mb-4">
          <ThemeToggle />
        </div>

        {/* Logo or Icon */}
        <TbBoxModel className="text-6xl dark:text-white" />

        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          Welcome to Production Optimiser 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Please sign in to your account and start the adventure
        </p>

        <form className="w-full space-y-4 font-mono">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'} // Toggle input type
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
              <span
                className="absolute right-4 top-3 cursor-pointer"
                onClick={togglePasswordVisibility} // Toggle visibility on click
              >
                {passwordVisible ? '🙈' : '👁️'}{' '}
                {/* Icon change based on visibility */}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-500 dark:text-indigo-400"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Remember me
              </span>
            </label>
            <a
              href="#"
              className="text-indigo-500 hover:underline dark:text-indigo-400"
            >
              Forgot password?
            </a>
          </div>

          <button className="w-full bg-indigo-500 dark:bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 transition duration-200">
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
