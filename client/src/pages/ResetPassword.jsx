import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as authService from "../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success("Password reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed - the link may have expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="panel w-full max-w-md space-y-5 p-8">
        <div className="text-center">
          <h1 className="text-xl font-bold">Set a new password</h1>
        </div>

        {done ? (
          <div className="rounded-lg bg-success-soft p-4 text-center text-sm text-success">
            Password reset successfully! Redirecting you to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password" required minLength={6} placeholder="New password (min 6 characters)" className="input-field"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Resetting..." : "Reset Password"}
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
