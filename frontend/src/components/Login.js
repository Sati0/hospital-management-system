import React, { useState } from 'react';

function Login({ onLogin, apiUrl }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'general practice',
    qualification: 'MBBS',
    experience: 1,
    feesPerSession: 500
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { ...formData, role };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-large">🏥</div>
          <h1>Hospital Management System</h1>
          <p>Healthcare services at your fingertips</p>
        </div>

        <div className="role-selector">
          <button 
            className={role === 'patient' ? 'active' : ''} 
            onClick={() => setRole('patient')}
          >
            👤 Patient
          </button>
          <button 
            className={role === 'doctor' ? 'active' : ''} 
            onClick={() => setRole('doctor')}
          >
            👨‍⚕️ Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              {role === 'doctor' && (
                <>
                  <select 
                    name="specialization" 
                    value={formData.specialization}
                    onChange={handleChange}
                  >
                    <option value="general practice">General Practice</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="surgery">Surgery</option>
                  </select>

                  <input
                    type="text"
                    name="qualification"
                    placeholder="Qualification (e.g., MBBS, MD)"
                    value={formData.qualification}
                    onChange={handleChange}
                  />

                  <input
                    type="number"
                    name="experience"
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                  />

                  <input
                    type="number"
                    name="feesPerSession"
                    placeholder="Consultation Fees"
                    value={formData.feesPerSession}
                    onChange={handleChange}
                    min="0"
                  />
                </>
              )}
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="toggle-auth">
          {isLogin ? (
            <p>
              Don't have an account? 
              <button onClick={() => setIsLogin(false)}>Register</button>
            </p>
          ) : (
            <p>
              Already have an account? 
              <button onClick={() => setIsLogin(true)}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
