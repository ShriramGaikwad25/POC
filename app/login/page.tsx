'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getCookie, verifyToken, COOKIE_NAMES } from '@/lib/auth';

export default function LoginPage() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  // Check for existing valid token on page load
  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const accessToken = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
        const jwtToken = getCookie(COOKIE_NAMES.JWT_TOKEN);
        console.log('Access token found:', !!accessToken);
        console.log('JWT token found:', !!jwtToken);
        
        if (accessToken && jwtToken) {
          // For now, assume token is valid if both tokens exist
          console.log('Both tokens found, redirecting to dashboard');
          router.push('/dashboard');
          return;
        } else {
          console.log('Missing tokens, showing login form');
        }
      } catch (error) {
        console.error('Token check error:', error);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkExistingToken();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Attempting login with userid:', userid);
      const success = await login(userid, password);
      console.log('Login success:', success);
      if (success) {
        console.log('Login successful, redirecting to dashboard');
        // Use window.location for a full page redirect to avoid router issues
        window.location.href = '/dashboard';
      } else {
        console.log('Login failed');
        setError('Invalid user ID or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  // Show loading state while checking token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - White Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-100/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-50/30 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-50/20 rounded-full blur-3xl"></div>
        
        {/* Content on left side - Our Brands and Statistics Grid */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full">
          {/* Our Brands Section */}
          <div className="mb-16 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-3">Our Brands</h2>
            <div className="h-px bg-gray-300 mb-6 w-full"></div>
            <div className="grid grid-cols-3 gap-6 items-center justify-items-center">
              {/* Arby's Logo */}
              <div className="flex items-center justify-center w-full h-16">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 8 Q25 5 30 8 Q35 5 40 8" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M25 8 L25 12 L35 12 L35 8" stroke="#000" strokeWidth="2" fill="none"/>
                  <text x="40" y="25" textAnchor="middle" fontFamily="serif" fontSize="14" fill="#000" fontStyle="italic">Arby's</text>
                </svg>
              </div>
              
              {/* BR (Baskin-Robbins) Logo */}
              <div className="flex items-center justify-center w-full h-16">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <text x="40" y="28" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#000">BR</text>
                  <text x="52" y="32" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">™</text>
                </svg>
              </div>
              
              {/* Buffalo Wild Wings Logo */}
              <div className="flex items-center justify-center w-full h-16">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="40" cy="20" r="15" stroke="#000" strokeWidth="2" fill="none"/>
                  <path d="M32 15 Q35 12 38 15" stroke="#000" strokeWidth="1.5" fill="none"/>
                  <path d="M42 15 Q45 12 48 15" stroke="#000" strokeWidth="1.5" fill="none"/>
                  <path d="M35 20 Q40 25 45 20" stroke="#000" strokeWidth="1.5" fill="none"/>
                  <path d="M30 18 L35 22 M45 22 L50 18" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              
              {/* Dunkin' Logo */}
              <div className="flex items-center justify-center w-full h-16">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M30 10 L30 28 Q30 32 34 32 L46 32 Q50 32 50 28 L50 10" stroke="#000" strokeWidth="2" fill="none"/>
                  <path d="M35 10 L35 6 L45 6 L45 10" stroke="#000" strokeWidth="2" fill="none"/>
                  <text x="40" y="24" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#000">D</text>
                </svg>
              </div>
              
              {/* JJ (Jimmy John's) Logo */}
              <div className="flex items-center justify-center w-full h-16">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <text x="40" y="28" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#DC143C">JJ</text>
                  <text x="52" y="32" fontFamily="Arial, sans-serif" fontSize="8" fill="#DC143C">™</text>
                </svg>
              </div>
              
              {/* SONIC Logo */}
              <div className="flex items-center justify-center w-full h-16">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <ellipse cx="40" cy="20" rx="35" ry="12" stroke="#000" strokeWidth="2" fill="none"/>
                  <text x="40" y="26" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#000">SONIC</text>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
            {/* Stat 1 - Global System Sales */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-red-600" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" fill="none"/>
                  <text x="24" y="28" textAnchor="middle" fill="#DC143C" fontSize="16" fontWeight="bold">$</text>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none"/>
                  <circle cx="36" cy="12" r="3" stroke="currentColor" fill="none"/>
                  <circle cx="12" cy="36" r="3" stroke="currentColor" fill="none"/>
                  <circle cx="36" cy="36" r="3" stroke="currentColor" fill="none"/>
                  <line x1="24" y1="24" x2="12" y2="12" stroke="currentColor"/>
                  <line x1="24" y1="24" x2="36" y2="12" stroke="currentColor"/>
                  <line x1="24" y1="24" x2="12" y2="36" stroke="currentColor"/>
                  <line x1="24" y1="24" x2="36" y2="36" stroke="currentColor"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">$32.6B+</div>
              <div className="text-xs text-gray-600">in Global System Sales</div>
            </div>

            {/* Stat 2 - Restaurants */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-red-600" strokeWidth="1.5">
                  <path d="M12 32 L12 20 L16 20 L16 16 L20 16 L20 20 L24 20 L24 32 L12 32 Z" stroke="currentColor" fill="none"/>
                  <path d="M14 20 L14 18 M18 20 L18 18 M22 20 L22 18" stroke="currentColor" strokeWidth="1"/>
                  <path d="M16 16 L16 12 L20 12 L20 16" stroke="currentColor" fill="none"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">33,000+</div>
              <div className="text-xs text-gray-600">Restaurants</div>
            </div>

            {/* Stat 3 - Team Members */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-red-600" strokeWidth="1.5">
                  <circle cx="16" cy="18" r="6" stroke="currentColor" fill="none"/>
                  <circle cx="24" cy="18" r="6" stroke="currentColor" fill="none"/>
                  <circle cx="32" cy="18" r="6" stroke="currentColor" fill="none"/>
                  <path d="M10 30 Q16 26 22 30" stroke="currentColor" fill="none"/>
                  <path d="M16 30 Q24 24 32 30" stroke="currentColor" fill="none"/>
                  <path d="M26 30 Q32 26 38 30" stroke="currentColor" fill="none"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">650,000</div>
              <div className="text-xs text-gray-600">Company and Franchise Team Members</div>
            </div>

            {/* Stat 4 - U.S. Digital Sales */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-red-600" strokeWidth="1.5">
                  <circle cx="24" cy="20" r="12" stroke="currentColor" fill="none"/>
                  <path d="M24 12 L24 16 L26 18 L24 20 L22 18 L24 16 Z" fill="#DC143C"/>
                  <path d="M12 20 L16 20 M32 20 L36 20" stroke="currentColor"/>
                  <path d="M24 8 L24 10 M24 30 L24 32" stroke="currentColor"/>
                  <path d="M12 28 Q16 32 20 28" stroke="currentColor" fill="none"/>
                  <path d="M28 28 Q32 32 36 28" stroke="currentColor" fill="none"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">$10B+</div>
              <div className="text-xs text-gray-600">U.S. Digital Sales</div>
            </div>

            {/* Stat 5 - Global Markets */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-red-600" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="18" stroke="currentColor" fill="none"/>
                  <path d="M12 16 Q18 12 24 16 Q30 12 36 16" stroke="currentColor" fill="none"/>
                  <path d="M12 24 Q18 20 24 24 Q30 20 36 24" stroke="currentColor" fill="none"/>
                  <path d="M12 32 Q18 28 24 32 Q30 28 36 32" stroke="currentColor" fill="none"/>
                  <path d="M24 6 L24 42" stroke="currentColor"/>
                  <circle cx="18" cy="18" r="2" fill="#DC143C"/>
                  <circle cx="30" cy="20" r="2" fill="#DC143C"/>
                  <circle cx="16" cy="28" r="2" fill="#DC143C"/>
                  <circle cx="32" cy="30" r="2" fill="#DC143C"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">~60</div>
              <div className="text-xs text-gray-600">Global Markets</div>
            </div>

            {/* Stat 6 - Franchisees */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-red-600" strokeWidth="1.5">
                  <path d="M12 32 L12 20 L16 20 L16 16 L20 16 L20 20 L24 20 L24 32 L12 32 Z" stroke="currentColor" fill="none"/>
                  <path d="M20 20 L20 12" stroke="currentColor"/>
                  <path d="M18 20 L18 16 L22 16 L22 20" stroke="currentColor" fill="none"/>
                  <path d="M28 32 L28 20 L32 20 L32 16 L36 16 L36 20 L40 20 L40 32 L28 32 Z" stroke="currentColor" fill="none"/>
                  <path d="M32 20 L32 12" stroke="currentColor"/>
                  <path d="M30 20 L30 16 L34 16 L34 20" stroke="currentColor" fill="none"/>
                  <line x1="20" y1="20" x2="32" y2="20" stroke="currentColor"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">2,800+</div>
              <div className="text-xs text-gray-600">Franchisees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative">
        {/* Grid background pattern for right side */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid-pattern"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8 -mt-4">
            <div className="flex items-center justify-center mb-3">
              <svg width="180" height="42" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-125">
                {/* Stylized "I" that looks like a fork with three tines extending upwards */}
                <path d="M10 10V26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Three fork tines at the top - left, center, right */}
                <path d="M6 6L6 10M10 6L10 10M14 6L14 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <text x="26" y="22" fill="white" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" letterSpacing="2">NSPIRE</text>
              </svg>
            </div>
            <p className="text-white text-sm font-medium tracking-wide">User Management Portal</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Log In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* User ID Field */}
              <div>
                <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID*
                </label>
                <input
                  type="text"
                  id="userid"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  placeholder="Insert your User ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insert your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-8 text-center">
              <p className="text-white">
                Don't have an account?{' '}
                <a href="#" className="text-white hover:text-red-100 font-medium underline">
                  Register with SSO
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
