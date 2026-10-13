import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    hostelName: '',
    foodPreference: 'Vegetarian',
    dailyBudget: '100',
    healthGoal: 'Healthy Eating',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      setError('');
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim() || 'University / College',
        hostelName: formData.hostelName.trim() || 'Campus Hostel',
        foodPreference: formData.foodPreference,
        dailyBudget: parseFloat(formData.dailyBudget) || 100,
        healthGoal: formData.healthGoal,
      });

      if (res.success) {
        setSuccess('Account created successfully! Welcome aboard! Redirecting...');
        setTimeout(() => {
          navigate('/student', { replace: true });
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-icon-badge">✨</div>
          <h1 className="auth-title">Create Your Student Account</h1>
          <p className="auth-subtitle">
            Unlock AI meal planning, budget tracking, and tailored nutritional guidance for hostel life.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <span>🎉</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Vyshali Gugulothu"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="password">Password (min 6 chars) *</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="input-with-icon">
                <span className="input-icon">🔐</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="college">College / University</label>
              <div className="input-with-icon">
                <span className="input-icon">🏛️</span>
                <input
                  type="text"
                  id="college"
                  name="college"
                  placeholder="e.g. IIT, NIT, University"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hostelName">Hostel / Hall of Residence</label>
              <div className="input-with-icon">
                <span className="input-icon">🏢</span>
                <input
                  type="text"
                  id="hostelName"
                  name="hostelName"
                  placeholder="e.g. Ganga Hostel, Block B"
                  value={formData.hostelName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="foodPreference">Food Preference</label>
              <select
                id="foodPreference"
                name="foodPreference"
                value={formData.foodPreference}
                onChange={handleChange}
              >
                <option value="Vegetarian">🌱 Vegetarian</option>
                <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                <option value="Vegan">🥗 Vegan</option>
                <option value="Eggetarian">🍳 Eggetarian</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dailyBudget">Daily Budget (₹)</label>
              <div className="input-with-icon">
                <span className="input-icon">₹</span>
                <input
                  type="number"
                  id="dailyBudget"
                  name="dailyBudget"
                  min="30"
                  max="1000"
                  step="5"
                  value={formData.dailyBudget}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="healthGoal">Primary Goal</label>
              <select
                id="healthGoal"
                name="healthGoal"
                value={formData.healthGoal}
                onChange={handleChange}
              >
                <option value="Healthy Eating">🥗 Healthy Eating</option>
                <option value="Muscle Gain">💪 Muscle Gain</option>
                <option value="Weight Loss">⚖️ Weight Loss</option>
                <option value="Energy & Focus">⚡ Energy & Focus</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Your Account...' : 'Complete Registration & Start Planning →'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already registered?{' '}
            <Link to="/login" className="auth-link">
              Log in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
