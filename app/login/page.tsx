'use client'
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleClick = () => {
    const loading = toast.loading("Logging in");
    try {
      signIn("google", { callbackUrl: '/' });
      toast.dismiss(loading);
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to Log in, please try again");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Fill all fields!");
      return;
    }
    if (!email.includes("@") || !email.includes(".") || email.length > 100) {
      setError("Invalid email, must include @ and domain!");
      return;
    }

    const loading = toast.loading("Signing in");
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
      toast.dismiss(loading);
      toast.success("Signed in successfully");
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg shadow-md p-8 bg-white">
        <h2 className="text-2xl font-semibold text-center text-black mb-1">Login</h2>
        <p className="text-sm text-center text-gray-600 mb-6">Welcome back to ECOMMERCE</p>
        <p className="text-xs text-center text-pink-600 font-semibold mb-6">The next-gen business marketplace</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <span
              className="absolute right-3 top-2.5 text-sm cursor-pointer text-gray-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:opacity-90"
          >
            LOGIN
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an Account?{" "}
          <span
            onClick={() => router.push('/signup')}
            className="text-black font-medium underline cursor-pointer"
          >
            SIGN UP
          </span>
        </p>
        <div className="my-6 border-t" />
        <div className="text-center text-sm text-gray-500 mb-2">or</div>
        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="p-2 rounded-full bg-white border hover:shadow-md transition"
          >
            <FcGoogle className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
