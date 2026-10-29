import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Camera, Github, Linkedin, Globe, Trash2, KeyRound, Award, Save,
} from "lucide-react";
import * as profileService from "../services/profileService";
import * as resumeService from "../services/resumeService";
import * as aptitudeService from "../services/aptitudeService";
import * as codingService from "../services/codingService";
import * as interviewService from "../services/interviewService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const EDUCATION_OPTIONS = ["High School", "Bachelors", "Masters", "PhD"];
const JOB_ROLE_OPTIONS = [
  "Software Engineer", "Data Scientist", "Data Analyst", "Frontend Developer",
  "Backend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer",
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { user: profile } = await profileService.getMyProfile();
        setForm({ ...profile, skills: (profile.skills || []).join(", ") });
        computeAchievements();
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const computeAchievements = async () => {
    try {
      const [resumeRes, aptitudeRes, codingRes, interviewRes] = await Promise.all([
        resumeService.getResumeHistory(),
        aptitudeService.getAptitudeHistory(),
        codingService.getCodingHistory(),
        interviewService.getInterviewHistory(),
      ]);
      const badges = [];
      if (resumeRes.resumes?.length >= 1) badges.push({ label: "First Resume Uploaded", icon: "📄" });
      if (codingRes.records?.length >= 5) badges.push({ label: "5 Coding Submissions", icon: "💻" });
      if (aptitudeRes.records?.some((r) => r.score >= 80)) badges.push({ label: "Aptitude Master (80%+)", icon: "🧠" });
      if (interviewRes.interviews?.length >= 1) badges.push({ label: "First Interview Completed", icon: "🎤" });
      if (interviewRes.interviews?.length >= 3) badges.push({ label: "Interview Pro (3+)", icon: "🏆" });
      setAchievements(badges);
    } catch {
      // non-fatal
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      const { user: updated } = await profileService.updateMyProfile(payload);
      updateUser(updated);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(file.type.toLowerCase()) || !allowedExt.includes(ext)) {
      toast.error("Unsupported file type. Please upload a JPG, JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image is too large. Please upload a file under 3MB.");
      return;
    }

    // Show an instant local preview while the real upload is in flight
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarPreview(localPreviewUrl);
    setAvatarUploading(true);

    try {
      const { avatarUrl } = await profileService.uploadAvatar(file);
      updateUser({ avatarUrl }); // updates context + localStorage immediately, no refresh needed
      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
      setAvatarPreview(null); // revert to the last saved photo on failure
    } finally {
      setAvatarUploading(false);
      URL.revokeObjectURL(localPreviewUrl);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await profileService.changePassword(pwForm);
      toast.success("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await profileService.deleteMyAccount();
      toast.success("Account deleted");
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading || !form) return <Loader label="Loading your profile..." />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Avatar + basic info */}
      <div className="panel flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        <label className="group relative cursor-pointer">
          {avatarPreview || user?.avatarUrl ? (
            <img src={avatarPreview || user.avatarUrl} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-3xl font-bold text-white">
              {form.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={20} />
          </div>
          {avatarUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          )}
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
        </label>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <input name="name" value={form.name} onChange={handleChange} className="input-field text-lg font-semibold" />
          </div>
          <p className="text-sm text-white/50">{form.email}</p>
          {achievements.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {achievements.map((a, i) => (
                <span key={i} className="badge-brand">
                  {a.icon} {a.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Academic / contact info */}
      <div className="panel space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/70">
          <Award size={16} /> Academic & Contact
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Target Role" name="targetRole" value={form.targetRole} onChange={handleChange} />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Field label="College" name="college" value={form.college} onChange={handleChange} />
          <Field label="Department" name="department" value={form.department} onChange={handleChange} />
          <Field label="Year" name="year" value={form.year} onChange={handleChange} />
          <Field label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
          <Field label="GitHub" name="github" value={form.github} onChange={handleChange} icon={Github} />
          <Field label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} icon={Linkedin} />
          <Field label="Portfolio" name="portfolio" value={form.portfolio} onChange={handleChange} icon={Globe} />
          <Field label="Experience (years)" name="experience" value={form.experience} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/60">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/60">Skills (comma-separated)</label>
          <input name="skills" value={form.skills} onChange={handleChange} className="input-field" placeholder="React, Node.js, MongoDB" />
        </div>
      </div>

      {/* ML model inputs */}
      <div className="panel space-y-4 p-6">
        <h2 className="text-sm font-semibold text-white/70">
          Placement Predictor Inputs <span className="text-white/40">(used by your trained ML models)</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Projects Count" name="projectsCount" type="number" value={form.projectsCount} onChange={handleChange} />
          <Field label="Certifications Count" name="certificationsCount" type="number" value={form.certificationsCount} onChange={handleChange} />
          <Field label="Confidence Level (1-10)" name="confidenceLevel" type="number" min={1} max={10} value={form.confidenceLevel} onChange={handleChange} />
          <Field label="Expected Salary ($)" name="salaryExpectation" type="number" value={form.salaryExpectation} onChange={handleChange} />
          <SelectField label="Education Level" name="educationLevel" value={form.educationLevel} onChange={handleChange} options={EDUCATION_OPTIONS} />
          <SelectField label="Job Role Category" name="jobRoleCategory" value={form.jobRoleCategory} onChange={handleChange} options={JOB_ROLE_OPTIONS} />
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" name="internshipDone" checked={!!form.internshipDone} onChange={handleChange} className="h-4 w-4 rounded accent-brand" />
          I have completed an internship
        </label>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
      </button>

      {/* Password change */}
      <div className="panel space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/70">
          <KeyRound size={16} /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="password" placeholder="Current password" className="input-field"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
          />
          <input
            type="password" placeholder="New password (min 6 chars)" className="input-field"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
          />
          <button type="submit" className="btn-secondary sm:col-span-2">Update Password</button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="panel space-y-3 border-danger/30 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-danger">
          <Trash2 size={16} /> Delete Account
        </h2>
        <p className="text-sm text-white/50">
          This permanently deletes your account and all associated resumes, test history, and reports.
        </p>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="btn-secondary text-danger">
            Delete My Account
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleDeleteAccount} className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white">
              Yes, permanently delete
            </button>
            <button onClick={() => setConfirmDelete(false)} className="btn-secondary">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-sm text-white/60">
        {Icon && <Icon size={13} />} {label}
      </label>
      <input className="input-field" {...props} />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-white/60">{label}</label>
      <select className="input-field" {...props}>
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface">{o}</option>
        ))}
      </select>
    </div>
  );
}
