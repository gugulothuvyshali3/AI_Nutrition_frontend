import React from 'react';
import { useNavigate } from 'react-router-dom';

const foodImages = {
  hero: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=85",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
  ingredients: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=900&q=85",
  balanced: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> SMART • HEALTHY • AFFORDABLE
          </div>
          <h1>
            AI Nutrition Advisor<br />
            <span>Eat Healthy. Spend Smart.</span>
          </h1>
          <p className="hero-description">
            Personalized and affordable nutrition for hostel students. Tailored meal combinations built around your available groceries, food preference, and daily budget.
          </p>
          <div className="hero-actions">
            <button
              className="button button-primary"
              onClick={() => navigate('/student')}
            >
              ✨ Get My Meal Plan <span>→</span>
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate('/foods')}
            >
              🍎 Explore Foods
            </button>
          </div>
          <div className="hero-trust">
            <span className="trust-avatars">🥑 🍅 🥦</span>
            <div>
              <b>Fresh Food · Healthy Life</b>
              <small>Small everyday choices. Better hostel habits. 💚</small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src={foodImages.hero}
              alt="A colorful healthy meal with fresh vegetables"
            />
          </div>
          <div className="floating-tag tag-top">
            <span>🌿</span>
            <div>
              <b>Eat fresh</b>
              <small>Feel energetic all day</small>
            </div>
          </div>
          <div className="floating-tag tag-bottom">
            <span className="tag-check">✓</span>
            <div>
              <b>Budget friendly</b>
              <small>Healthy can cost less</small>
            </div>
          </div>
          <div className="hero-image-caption">
            🥗 <span>Fresh Food · Healthy Life · Hostel Friendly</span> 💚
          </div>
        </div>
      </section>

      {/* Benefits of Affordable, Healthy Eating */}
      <section className="benefits-section">
        <div className="section-heading">
          <span className="section-kicker">YOUR HEALTH, YOUR WAY</span>
          <h2>Why choose <span>AI Nutrition Advisor?</span></h2>
          <p>Overcoming the hostel food dilemma with smart algorithms and pocket-friendly choices.</p>
        </div>

        <div className="benefit-grid">
          <article className="benefit-card">
            <div className="benefit-image">
              <img src={foodImages.vegetables} alt="Fresh vegetables and nutrients" />
            </div>
            <div className="benefit-copy">
              <span className="benefit-icon">🥗</span>
              <h3>Personalized Nutrition</h3>
              <p>Meal suggestions dynamically calculated from your age, body goals, and vegetarian, non-vegetarian, or vegan preferences.</p>
            </div>
          </article>

          <article className="benefit-card">
            <div className="benefit-image">
              <img src={foodImages.ingredients} alt="Affordable hostel ingredients" />
            </div>
            <div className="benefit-copy">
              <span className="benefit-icon">💰</span>
              <h3>Budget Friendly</h3>
              <p>Plan balanced meals starting at as low as ₹50 - ₹150 a day without sacrificing required proteins or micronutrients.</p>
            </div>
          </article>

          <article className="benefit-card">
            <div className="benefit-image">
              <img src={foodImages.balanced} alt="Balanced healthy meal" />
            </div>
            <div className="benefit-copy">
              <span className="benefit-icon">🤖</span>
              <h3>Smart AI Algorithms</h3>
              <p>Prevents boring repetition, checks allergy safety, and explains why each meal was chosen for your lifestyle.</p>
            </div>
          </article>
        </div>

        {/* CTA Banner */}
        <div className="home-cta">
          <div>
            <span className="section-kicker">START TODAY</span>
            <h2>Better hostel meals start with <span>one smart click.</span></h2>
          </div>
          <button
            className="button button-primary"
            onClick={() => navigate('/student')}
          >
            Create My Meal Plan <span>→</span>
          </button>
        </div>
      </section>
    </>
  );
}
