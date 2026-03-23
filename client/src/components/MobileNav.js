import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MobileNav({ active, setActive, nav }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-inner">
        {nav.map(item => (
          <button
            key={item.id}
            className={`mn-item ${active === item.id ? 'mn-active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <div className="mn-icon-wrap">
              <span className="mn-icon">{item.icon}</span>
            </div>
            {item.badge > 0 && <span className="mn-badge">{item.badge}</span>}
            <span>{item.label}</span>
          </button>
        ))}
        <button
          className="mn-item"
          onClick={() => { logout(); navigate('/'); }}
        >
          <div className="mn-icon-wrap">
            <span className="mn-icon">🚪</span>
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}