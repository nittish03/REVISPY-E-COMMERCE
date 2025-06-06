'use client'

import React, { FormEvent, useState } from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [register, setRegister] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError('Fill all fields!');
      return;
    }
    try {
      const loading = toast.loading("Registering");
      const response = await axios.post("/api/auth/register", { username, email, password });
      toast.dismiss(loading);
      if (response) {
        toast.success("OTP SENT SUCCESSFULLY");
        setRegister(true);
      } else {
        toast.error("Signup Failed");
      }
    } catch (e) {
      toast.error("Signup failed");
      console.log(e);
    }
  };

  const handleOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    try {
      const loading = toast.loading("Signing in");
      const response = await axios.post("/api/auth/otp-verification", { email, otp });
      toast.dismiss(loading);
      if (response) {
        toast.success("Signed In successfully");
        await signIn("credentials", { email, password, callbackUrl: "/", redirect: true });
        router.push("/login");
      } else {
        toast.error("Failed to sign in");
      }
    } catch (e) {
      toast.error("An error occurred");
      console.log(e);
    }
  };

  const handleResendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      if (response) {
        toast.success("OTP Resent Successfully");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-md">
        {!register ? (
          <>
            <h1 className="text-xl font-semibold text-center mb-6">Create your account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="w-full py-2 bg-black text-white rounded-md">CREATE ACCOUNT</button>
            </form>
            <p className="mt-4 text-center text-sm">Have an Account? <span onClick={() => redirect('/login')} className="font-medium cursor-pointer">LOGIN</span></p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-center mb-6">Enter OTP</h1>
            <form onSubmit={handleOTP} className="space-y-6">
              <p className="text-sm text-center">OTP sent to <span className="font-medium">{email}</span></p>
              <InputOTP maxLength={6} onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setOtp(value);
                  setError('');
                } else {
                  setError("Only numbers allowed");
                }
              }}>
                <InputOTPGroup className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-12 border border-gray-300 rounded-md text-xl text-center bg-gray-100"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="w-full py-2 bg-black text-white rounded-md">VERIFY OTP</button>
              <p className="text-sm text-center">Didn't receive OTP? <button onClick={handleResendOTP} className="text-black underline">Send Again</button></p>
              <button type="button" onClick={() => setRegister(false)} className="text-sm text-center text-black underline w-full">Change Email</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
