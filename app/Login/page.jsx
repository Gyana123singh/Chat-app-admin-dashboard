"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import { adminApi } from "../utils/api/authApi";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 OTP states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const router = useRouter();

  /* ---------------- EMAIL LOGIN ---------------- */
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Enter email & password");
        return;
      }

      const data = await adminApi.loginAdmin(email, password);
      localStorage.setItem("adminAuthToken", data.token);
      alert("Email Login Success");
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  /* ---------------- SEND OTP ---------------- */
  const sendOTP = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmation(result);
      alert("OTP Sent");
    } catch (error) {
      console.error(error);
      alert("OTP sending failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div id="recaptcha-container"></div>

      {/* Purple Background */}
      <div className="absolute bottom-0 left-0 w-full h-[55%] bg-[#6c3eff] -z-10 skew-y-[-8deg] origin-bottom"></div>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg z-20">
        <div className="flex justify-center mb-6">
          <Image src="/Dil (2).png" alt="Logo" width={100} height={20} />
        </div>

        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {/* ---------------- EMAIL LOGIN ---------------- */}
        <div className="mb-5">
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button
          className="w-full bg-[#6c3eff] text-white py-3 rounded-lg text-lg"
          onClick={handleLogin}
        >
          Login
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:5000/auth/google")
          }
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg mt-4"
        >
          <img src="/google.svg" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
