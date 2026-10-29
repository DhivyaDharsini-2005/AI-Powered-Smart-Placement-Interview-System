import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    targetRole: "Software Development Engineer",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Account created! Welcome aboard.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="panel w-full max-w-md space-y-5 p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
            AI
          </div>
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="text-sm text-white/50">Start practicing for your dream placement</p>
        </div>

        <GoogleLoginButton onSuccess={() => navigate("/dashboard")} />

        <div className="flex items-center gap-3 text-xs text-white/30">
          <div className="h-px flex-1 bg-surface-border" /> OR <div className="h-px flex-1 bg-surface-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-white/70">Full Name</label>
            <input
              name="name"
              required
              className="input-field"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="input-field"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">Target Role</label>
            <input
              name="targetRole"
              className="input-field"
              value={form.targetRole}
              onChange={handleChange}
              placeholder="e.g. SDE, Data Analyst"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
