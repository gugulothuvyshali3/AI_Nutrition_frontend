import React from 'react';

export default function DashboardCharts({ foodPreferences = {}, healthGoals = {}, budgetDistribution = {} }) {
  // 1. Food Preferences data
  const prefEntries = Object.entries(foodPreferences);
  const totalPrefs = prefEntries.reduce((sum, [, val]) => sum + val, 0);
  const prefColors = {
    Vegetarian: '#2e7d32',
    'Non-Vegetarian': '#d32f2f',
    Vegan: '#1976d2',
    Other: '#7b1fa2',
  };

  // 2. Health Goals data
  const goalEntries = Object.entries(healthGoals);
  const totalGoals = goalEntries.reduce((sum, [, val]) => sum + val, 0);
  const goalColors = {
    'Healthy Eating': '#388e3c',
    'Weight Gain': '#f57c00',
    'Weight Loss': '#0097a7',
    Other: '#5d4037',
  };

  // 3. Budget Distribution data
  const budgetEntries = Object.entries(budgetDistribution);
  const maxBudgetCount = Math.max(...budgetEntries.map(([, val]) => val), 1);

  return (
    <div className="charts-grid">
      {/* Chart 1: Food Preferences */}
      <div className="chart-card">
        <h3>🥗 Food Preferences</h3>
        <p className="chart-subtitle">Distribution across student profiles</p>

        {totalPrefs === 0 ? (
          <p className="empty-state" style={{ padding: '30px 0' }}>No preference data available</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', height: '22px', borderRadius: '11px', overflow: 'hidden', background: '#e0eedf' }}>
              {prefEntries.map(([name, count]) => {
                if (count === 0) return null;
                const pct = Math.round((count / totalPrefs) * 100);
                return (
                  <div
                    key={name}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: prefColors[name] || '#81c784',
                      transition: 'width 0.4s ease',
                    }}
                    title={`${name}: ${count} (${pct}%)`}
                  />
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {prefEntries.map(([name, count]) => {
                const pct = totalPrefs > 0 ? Math.round((count / totalPrefs) * 100) : 0;
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: prefColors[name] || '#81c784',
                        }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{name}</span>
                    </div>
                    <span style={{ fontSize: '14px', color: '#5c7963' }}>
                      <b>{count}</b> ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chart 2: Health Goals */}
      <div className="chart-card">
        <h3>🎯 Health Goals</h3>
        <p className="chart-subtitle">Student targets and wellness ambitions</p>

        {totalGoals === 0 ? (
          <p className="empty-state" style={{ padding: '30px 0' }}>No goal data recorded yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {goalEntries.map(([goal, count]) => {
              const pct = totalGoals > 0 ? Math.round((count / totalGoals) * 100) : 0;
              const color = goalColors[goal] || '#4caf50';
              return (
                <div key={goal}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>{goal}</span>
                    <span style={{ color: '#5c7963' }}><b>{count}</b> students ({pct}%)</span>
                  </div>
                  <div style={{ height: '10px', background: '#e0eedf', borderRadius: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: color,
                        borderRadius: '5px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chart 3: Budget Distribution */}
      <div className="chart-card">
        <h3>💰 Daily Budget Distribution</h3>
        <p className="chart-subtitle">Spending limits for hostel students</p>

        {budgetEntries.length === 0 || maxBudgetCount === 0 ? (
          <p className="empty-state" style={{ padding: '30px 0' }}>No budget profiles yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            {budgetEntries.map(([tier, count]) => {
              const barHeightPct = Math.round((count / maxBudgetCount) * 100);
              return (
                <div key={tier}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#1f502d' }}>{tier}</span>
                    <span style={{ color: '#5c7963' }}>{count} {count === 1 ? 'student' : 'students'}</span>
                  </div>
                  <div style={{ height: '12px', background: '#edf6eb', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${barHeightPct}%`,
                        background: 'linear-gradient(90deg, #4caf50, #2e7d32)',
                        borderRadius: '6px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
