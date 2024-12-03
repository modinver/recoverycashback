import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Moon, Loader2 } from 'lucide-react';
import type { AuthFormData } from '../../types/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type AuthMode = 'login' | 'register' | 'reset';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register: registerUser, resetPassword } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(
      mode === 'login' ? loginSchema : 
      mode === 'register' ? registerSchema : 
      resetSchema
    ),
  });

  const onSubmit = async (data: AuthFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        navigate('/admin');
      } else if (mode === 'register') {
        await registerUser(data.email, data.password, data.name!);
        navigate('/admin');
      } else if (mode === 'reset') {
        await resetPassword(data.email);
        setResetSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Moon className="w-10 h-10 text-emerald-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Admin Login' :
             mode === 'register' ? 'Create Account' :
             'Reset Password'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {resetSent ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Password reset instructions have been sent to your email.
            </p>
            <button
              onClick={() => switchMode('login')}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                'Sign in'
              ) : mode === 'register' ? (
                'Create account'
              ) : (
                'Send reset instructions'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col space-y-2 text-sm text-center">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => switchMode('register')}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Create new account
              </button>
              <button
                onClick={() => switchMode('reset')}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <button
              onClick={() => switchMode('login')}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;