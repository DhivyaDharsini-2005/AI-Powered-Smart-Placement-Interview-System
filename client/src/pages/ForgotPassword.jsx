import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as authService from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="panel w-full max-w-md space-y-5 p-8">
        <div className="text-center">
          <h1 className="text-xl font-bold">Reset your password</h1>
          <p className="text-sm text-white/50">We'll email you a link to set a new one.</p>
        </div>

        {sent ? (
          <div className="rounded-lg bg-success-soft p-4 text-center text-sm text-success">
            If that email is registered, a reset link has been sent. Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email" required placeholder="you@example.com" className="input-field"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-white/50">
          <Link to="/login" className="text-brand-light hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
