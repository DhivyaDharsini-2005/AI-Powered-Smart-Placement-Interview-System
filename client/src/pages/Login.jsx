import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="panel w-full max-w-md space-y-5 p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
            AI
          </div>
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="text-sm text-white/50">Sign in to your Smart Placement System account</p>
        </div>

        <GoogleLoginButton onSuccess={() => navigate("/dashboard")} />

        <div className="flex items-center gap-3 text-xs text-white/30">
          <div className="h-px flex-1 bg-surface-border" /> OR <div className="h-px flex-1 bg-surface-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-white/60">Email</label>
            <input type="email" name="email" required className="input-field" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm text-white/60">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-light hover:underline">Forgot password?</Link>
            </div>
            <input type="password" name="password" required className="input-field" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-white/50">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-brand-light hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
