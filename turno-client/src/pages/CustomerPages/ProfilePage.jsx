import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as authApi from '../../api/auth.js';

const inputClasses = 'mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F4B41A]/50 focus:bg-white/8 focus:ring-1 focus:ring-[#F4B41A]/30 placeholder:text-white/20';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileMsg(''); setProfileError('');
    if (!profileForm.firstName || !profileForm.lastName) return setProfileError('Name fields are required.');
    setProfileLoading(true);
    try {
      await authApi.updateMe(profileForm);
      await refreshUser();
      setProfileMsg('Profile updated successfully! ✅');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally { setProfileLoading(false); }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPassMsg(''); setPassError('');
    if (passForm.newPassword !== passForm.confirmPassword) return setPassError('New passwords do not match.');
    if (passForm.newPassword.length < 6) return setPassError('New password must be at least 6 characters.');
    setPassLoading(true);
    try {
      await authApi.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassMsg('Password changed successfully! ✅');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password.');
    } finally { setPassLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0A192F] font-['Outfit']">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F4B41A]/70">My Account</p>
          <h1 className="text-3xl font-black text-white">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-[#112240] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full border-2 border-[#F4B41A]/40 bg-[#F4B41A]/10 flex items-center justify-center text-[#F4B41A] text-2xl font-black">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="text-xl font-black text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-blue-300/50">{user?.email}</p>
              <span className={`inline-block mt-1 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${user?.role === 'admin' ? 'bg-[#F4B41A]/20 text-[#F4B41A]' : 'bg-blue-500/10 text-blue-300'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <h2 className="font-bold text-white border-b border-white/10 pb-2">Edit Information</h2>
            {profileError && <p className="text-sm text-red-400 font-medium">⚠️ {profileError}</p>}
            {profileMsg && <p className="text-sm text-emerald-400 font-medium">{profileMsg}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-firstName" className="text-xs font-bold uppercase tracking-widest text-blue-300/50">First Name</label>
                <input
                  id="profile-firstName"
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="profile-lastName" className="text-xs font-bold uppercase tracking-widest text-blue-300/50">Last Name</label>
                <input
                  id="profile-lastName"
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
                  className={inputClasses}
                />
              </div>
            </div>
            <button type="submit" disabled={profileLoading}
              className="rounded-xl bg-[#F4B41A] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0A192F] shadow-lg transition hover:bg-[#FFC72C] disabled:opacity-50">
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-white/10 bg-[#112240] p-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h2 className="font-bold text-white border-b border-white/10 pb-2">Change Password</h2>
            {passError && <p className="text-sm text-red-400 font-medium">⚠️ {passError}</p>}
            {passMsg && <p className="text-sm text-emerald-400 font-medium">{passMsg}</p>}
            <div>
              <label htmlFor="profile-currentPw" className="text-xs font-bold uppercase tracking-widest text-blue-300/50">Current Password</label>
              <input
                id="profile-currentPw"
                type="password"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm((f) => ({ ...f, currentPassword: e.target.value }))}
                className={inputClasses}
                placeholder="Current password"
              />
            </div>
            <div>
              <label htmlFor="profile-newPw" className="text-xs font-bold uppercase tracking-widest text-blue-300/50">New Password</label>
              <input
                id="profile-newPw"
                type="password"
                value={passForm.newPassword}
                onChange={(e) => setPassForm((f) => ({ ...f, newPassword: e.target.value }))}
                className={inputClasses}
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label htmlFor="profile-confirmPw" className="text-xs font-bold uppercase tracking-widest text-blue-300/50">Confirm New Password</label>
              <input
                id="profile-confirmPw"
                type="password"
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className={inputClasses}
                placeholder="Repeat new password"
              />
            </div>
            <button type="submit" disabled={passLoading}
              className="rounded-xl bg-[#F4B41A] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0A192F] shadow-lg transition hover:bg-[#FFC72C] disabled:opacity-50">
              {passLoading ? 'Updating…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
