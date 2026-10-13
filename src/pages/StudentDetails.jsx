import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const sideImage = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85";

const initialForm = {
  name: '',
  age: '',
  gender: 'Female',
  height: '',
  weight: '',
  activityLevel: 'Moderate',
  foodPreference: 'Vegetarian',
  budget: '',
  goal: 'Healthy Eating',
  availableFoods: '',
  allergies: '',
  healthCondition: '',
  nutritionDetails: '',
};

export default function StudentDetails() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error' | 'info', text: '' }
  const [generatedRecommendation, setGeneratedRecommendation] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        foodPreference: prev.foodPreference || user.foodPreference || 'Vegetarian',
        budget: prev.budget || (user.dailyBudget ? String(user.dailyBudget) : ''),
        goal: prev.goal || user.healthGoal || 'Healthy Eating',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter student name';
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = 'Please enter a valid age (1-120)';
    if (!formData.budget || Number(formData.budget) <= 0) newErrors.budget = 'Please enter a daily budget greater than ₹0';
    if (!formData.availableFoods.trim()) newErrors.availableFoods = 'Please specify available foods (e.g. rice, dal, eggs, banana)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields marked with *' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Saving student details to MySQL and analyzing meal plan...' });
    setGeneratedRecommendation(null);

    try {
      const payload = {
        name: formData.name.trim(),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        budget: parseFloat(formData.budget),
        foodPreference: formData.foodPreference,
        availableFoods: formData.availableFoods.trim(),
        allergies: formData.allergies.trim(),
        healthCondition: formData.healthCondition.trim(),
        nutritionDetails: formData.nutritionDetails.trim(),
      };

      // 1. Save student to MySQL
      const savedStudent = await api.createStudent(payload);

      // 2. Automatically generate personalized recommendation
      const recommendation = await api.generateRecommendation(savedStudent.id);

      setGeneratedRecommendation(recommendation);
      setStatusMessage({
        type: 'success',
        text: `Student "${savedStudent.name}" saved! Personalized meal plan generated successfully!`,
      });
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not connect to backend server. Make sure Spring Boot is running on port 8080.',
      });
    } finally {
      setLoading(false);
    }
  };

  const bmi =
    formData.height && formData.weight && Number(formData.height) > 0 && Number(formData.weight) > 0
      ? (Number(formData.weight) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1)
      : null;

  return (
    <div className="page-container">
      <div className="page-title">
        <span className="section-kicker">PERSONALIZED MEAL PLANNER</span>
        <h1>Student Details &amp; Profile</h1>
        <p>Tell us your food preferences, hostel budget, and grocery supplies to receive an optimized daily meal plan.</p>
      </div>

      {!isAuthenticated && (
        <div className="auth-alert-banner">
          <div className="auth-alert-content">
            <span className="auth-alert-icon">🔒</span>
            <div>
              <strong>Save Your Progress Across Devices!</strong>
              <p>Create a free student account or log in to automatically sync your profile and access all meal plans.</p>
            </div>
          </div>
          <div className="auth-alert-actions">
            <Link to="/login" className="button button-secondary">Log In</Link>
            <Link to="/register" className="button button-primary">Register Free</Link>
          </div>
        </div>
      )}

      <div className="content-split">
        {/* Form Panel */}
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h3>👩‍🎓 Student Profile</h3>

          {statusMessage && (
            <div className={`status-message ${statusMessage.type}`}>
              {statusMessage.type === 'success' && '✓ '}
              {statusMessage.type === 'error' && '⚠️ '}
              {statusMessage.type === 'info' && '⏳ '}
              {statusMessage.text}
            </div>
          )}

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Student Name *</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="age">Age *</label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 20"
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="foodPreference">Food Preference *</label>
              <select
                id="foodPreference"
                name="foodPreference"
                value={formData.foodPreference}
                onChange={handleChange}
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="budget">Daily Budget (₹) *</label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="1"
                step="1"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 100"
              />
              {errors.budget && <span className="field-error">{errors.budget}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="goal">Health Goal *</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="Healthy Eating">Healthy Eating</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Weight Loss">Weight Loss</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field full-field">
              <label htmlFor="availableFoods">Available Foods / Ingredients *</label>
              <textarea
                id="availableFoods"
                name="availableFoods"
                value={formData.availableFoods}
                onChange={handleChange}
                placeholder="e.g. rice, dal, banana, eggs, vegetables, milk, curd"
                rows="3"
              />
              {errors.availableFoods && <span className="field-error">{errors.availableFoods}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                min="50"
                max="250"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 165"
              />
            </div>

            <div className="form-field">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="20"
                max="300"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 58"
              />
            </div>

            {bmi && (
              <div className="full-field">
                <div className="bmi-badge">
                  <span>📊</span>
                  <span>Estimated Body Mass Index (BMI): <b>{bmi}</b></span>
                </div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="Sedentary">Sedentary (mostly studying)</option>
                <option value="Light">Light (occasional walks)</option>
                <option value="Moderate">Moderate (daily walking/sports)</option>
                <option value="High">High (intense gym/athletics)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="allergies">Allergies (if any)</label>
              <input
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. peanuts, dairy, gluten (or None)"
              />
            </div>
          </div>

          <button
            type="submit"
            className="button button-primary full-button"
            disabled={loading}
          >
            {loading ? '⏳ Generating Plan...' : '✨ Generate Recommendation →'}
          </button>

          {/* Generated Recommendation Display */}
          {generatedRecommendation && (
            <div className="meal-result">
              <h3>🥗 Generated Personalized Meal Plan</h3>
              <div className="rec-summary" style={{ marginBottom: '16px' }}>
                <div>Est. Cost: <b>₹{generatedRecommendation.estimatedCost}</b></div>
                <div>Calories: <b>{generatedRecommendation.totalCalories} kcal</b></div>
                <div>Protein: <b>{generatedRecommendation.totalProtein} g</b></div>
                <div>Budget Limit: <b>₹{formData.budget}</b></div>
              </div>

              <div className="rec-grid" style={{ marginBottom: '20px' }}>
                <div className="meal-block">
                  <span>Breakfast</span>
                  <p>{generatedRecommendation.breakfast || 'Nutritious morning start'}</p>
                </div>
                <div className="meal-block">
                  <span>Lunch</span>
                  <p>{generatedRecommendation.lunch || 'Wholesome midday meal'}</p>
                </div>
                <div className="meal-block">
                  <span>Dinner</span>
                  <p>{generatedRecommendation.dinner || 'Light balanced dinner'}</p>
                </div>
                <div className="meal-block">
                  <span>Snack</span>
                  <p>{generatedRecommendation.snacks || 'Healthy evening snack'}</p>
                </div>
              </div>

              <h4 style={{ color: '#1f502d', marginBottom: '8px' }}>💡 Why this plan is recommended:</h4>
              <div className="rec-explanation" style={{ marginBottom: '20px' }}>
                {generatedRecommendation.explanation}
              </div>

              <details>
                <summary style={{ cursor: 'pointer', fontWeight: '700', color: '#2e7d32' }}>
                  View Full Recommendation Details
                </summary>
                <pre className="meal-plan-text" style={{ marginTop: '12px' }}>
                  {generatedRecommendation.recommendationText}
                </pre>
              </details>
            </div>
          )}
        </form>

        {/* Side Visual */}
        <aside className="side-visual">
          <img src={sideImage} alt="Fresh wholesome meal bowl" />
          <div className="side-visual-overlay">
            <span>🌱</span>
            <h3>Healthy hostel eating, made simpler.</h3>
            <p>Our algorithms optimize cost, required protein, and calories based specifically on the foods available to you.</p>
          </div>
          <div className="side-stat">
            <b>3</b>
            <span>key factors we balance:<br />your preference, your goal, your daily budget</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
