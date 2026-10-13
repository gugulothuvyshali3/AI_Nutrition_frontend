import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const initialNewFood = {
  foodName: '',
  price: '',
  calories: '',
  protein: '',
  carbohydrates: '',
  fat: '',
  category: 'Vegetarian',
  mealType: 'Any',
  imageUrl: '',
};

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState(initialNewFood);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const loadFoods = async () => {
    setLoading(true);
    try {
      const data = await api.getFoods({
        query: searchQuery,
        category: categoryFilter,
        maxPrice: maxPriceFilter ? parseFloat(maxPriceFilter) : undefined,
      });
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load foods:', err);
      setMessage({ type: 'error', text: 'Could not load foods from backend. Ensure Spring Boot is running.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, [categoryFilter, maxPriceFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFoods();
  };

  const handleAddFoodChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFoodSubmit = async (e) => {
    e.preventDefault();
    if (!newFood.foodName.trim()) {
      setMessage({ type: 'error', text: 'Food name is required' });
      return;
    }
    if (newFood.price === '' || Number(newFood.price) < 0) {
      setMessage({ type: 'error', text: 'Please enter a valid price' });
      return;
    }
    if (newFood.calories === '' || Number(newFood.calories) < 0) {
      setMessage({ type: 'error', text: 'Please enter valid calories' });
      return;
    }
    if (newFood.protein === '' || Number(newFood.protein) < 0) {
      setMessage({ type: 'error', text: 'Please enter valid protein' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        foodName: newFood.foodName.trim(),
        price: parseFloat(newFood.price),
        calories: parseFloat(newFood.calories),
        protein: parseFloat(newFood.protein),
        carbohydrates: newFood.carbohydrates ? parseFloat(newFood.carbohydrates) : 0,
        fat: newFood.fat ? parseFloat(newFood.fat) : 0,
        category: newFood.category,
        mealType: newFood.mealType,
        imageUrl: newFood.imageUrl.trim() || undefined,
      };

      const saved = await api.addFood(payload);
      setFoods((prev) => [saved, ...prev]);
      setNewFood(initialNewFood);
      setShowAddForm(false);
      setMessage({ type: 'success', text: `"${saved.foodName}" added successfully to MySQL!` });
    } catch (err) {
      console.error('Error adding food:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save food' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFood = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
      setMessage({ type: 'success', text: `"${name}" removed successfully.` });
    } catch (err) {
      console.error('Delete error:', err);
      setMessage({ type: 'error', text: 'Could not delete food: ' + err.message });
    }
  };

  return (
    <div className="page-container">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-kicker">AFFORDABLE HOSTEL GROCERIES</span>
          <h1>Hostel Food Library</h1>
          <p>Browse nutrient-dense and pocket-friendly foods with exact rupee pricing, calories, and protein values.</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Close Form' : '➕ Add New Food'}
        </button>
      </div>

      {message && (
        <div className={`status-message ${message.type}`}>
          {message.type === 'success' ? '✓ ' : '⚠️ '}
          {message.text}
        </div>
      )}

      {/* Collapsible Add Food Form */}
      {showAddForm && (
        <form className="panel form-panel" onSubmit={handleAddFoodSubmit} style={{ marginBottom: '32px' }}>
          <h3>➕ Add a New Food to MySQL</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="foodName">Food Name *</label>
              <input
                id="foodName"
                name="foodName"
                value={newFood.foodName}
                onChange={handleAddFoodChange}
                placeholder="e.g. Boiled Eggs (2 pcs)"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Diet Category *</label>
              <select
                id="category"
                name="category"
                value={newFood.category}
                onChange={handleAddFoodChange}
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="price">Price in Rupees (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.5"
                value={newFood.price}
                onChange={handleAddFoodChange}
                placeholder="e.g. 15"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="calories">Calories (kcal) *</label>
              <input
                id="calories"
                name="calories"
                type="number"
                min="0"
                step="1"
                value={newFood.calories}
                onChange={handleAddFoodChange}
                placeholder="e.g. 140"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="protein">Protein (g) *</label>
              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={newFood.protein}
                onChange={handleAddFoodChange}
                placeholder="e.g. 12"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="mealType">Meal Role</label>
              <select
                id="mealType"
                name="mealType"
                value={newFood.mealType}
                onChange={handleAddFoodChange}
              >
                <option value="Any">Any / Side</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="carbohydrates">Carbohydrates (g)</label>
              <input
                id="carbohydrates"
                name="carbohydrates"
                type="number"
                min="0"
                step="0.1"
                value={newFood.carbohydrates}
                onChange={handleAddFoodChange}
                placeholder="e.g. 24"
              />
            </div>

            <div className="form-field">
              <label htmlFor="fat">Fat (g)</label>
              <input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={newFood.fat}
                onChange={handleAddFoodChange}
                placeholder="e.g. 3.5"
              />
            </div>

            <div className="form-field full-field">
              <label htmlFor="imageUrl">Image URL (Optional)</label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={newFood.imageUrl}
                onChange={handleAddFoodChange}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Food to Database'}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="food-filter-bar">
        <form className="search-input-wrapper" onSubmit={handleSearchSubmit}>
          <span className="search-icon">🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by food name (e.g. Rice, Dal, Egg, Banana)..."
          />
        </form>

        <div className="filter-pills">
          {['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan'].map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '9999px',
            border: '1px solid #c8e3c7',
            background: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f502d',
          }}
        >
          <option value="">All Prices</option>
          <option value="15">Max ₹15 (Ultra Budget)</option>
          <option value="25">Max ₹25</option>
          <option value="40">Max ₹40</option>
        </select>
      </div>

      {/* Food Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#5c7963', fontSize: '18px' }}>
          ⏳ Loading hostel foods from MySQL...
        </div>
      ) : foods.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <h3>No matching foods found</h3>
          <p style={{ color: '#5c7963', marginTop: '6px' }}>Try clearing your search query or price filter.</p>
          <button
            className="button button-secondary"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
              setMaxPriceFilter('');
              loadFoods();
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {foods.map((food) => (
            <article key={food.id} className="food-card">
              <div className="food-card-img">
                <img
                  src={
                    food.imageUrl ||
                    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={food.foodName}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span
                  className={`food-badge ${
                    food.category === 'Vegetarian'
                      ? 'veg'
                      : food.category === 'Vegan'
                      ? 'vegan'
                      : 'non-veg'
                  }`}
                >
                  {food.category}
                </span>
              </div>

              <div className="food-card-body">
                <h3>{food.foodName}</h3>
                <div className="food-price">₹{food.price}</div>

                <div className="food-macros">
                  <div>
                    <span>Calories</span>
                    <strong>{food.calories} kcal</strong>
                  </div>
                  <div>
                    <span>Protein</span>
                    <strong>{food.protein} g</strong>
                  </div>
                  <div>
                    <span>Role</span>
                    <strong>{food.mealType || 'Staple'}</strong>
                  </div>
                </div>

                <div className="food-card-actions">
                  <small style={{ color: '#728c78' }}>
                    Carbs: {food.carbohydrates || 0}g · Fat: {food.fat || 0}g
                  </small>
                  <button
                    className="text-button"
                    style={{ color: '#d32f2f' }}
                    onClick={() => handleDeleteFood(food.id, food.foodName)}
                    title="Delete food item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
