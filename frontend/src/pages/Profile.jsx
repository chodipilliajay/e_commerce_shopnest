import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await api.put('/me/update', profileForm);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await api.put('/password/update', passwordForm);
      toast.success('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-2xl font-700">{user.name}</h1>
          <p className="text-sm text-slate-soft">{user.email}</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-ink/10">
        <button onClick={() => setTab('profile')} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${tab === 'profile' ? 'border-brand text-brand' : 'border-transparent text-slate-soft'}`}>
          <User className="h-4 w-4" /> Profile
        </button>
        <button onClick={() => setTab('password')} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${tab === 'password' ? 'border-brand text-brand' : 'border-transparent text-slate-soft'}`}>
          <Lock className="h-4 w-4" /> Change Password
        </button>
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name</label>
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" required />
          </div>
          <button type="submit" disabled={profileLoading} className="btn-primary disabled:opacity-60">
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current Password</label>
            <input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Confirm New Password</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="input-field" required />
          </div>
          <button type="submit" disabled={passwordLoading} className="btn-primary disabled:opacity-60">
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
