import React, { useState } from 'react';
import axios from 'axios';

const CourseCard = ({ course, onUpdate }) => {
  const [registering, setRegistering] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isFull = course.enrolled >= course.capacity;
  const isAdmin = user?.role === 'admin';

  const handleRegister = async () => {
    if (!token) return;

    setRegistering(true);
    try {
      await axios.post('http://localhost:5000/api/registrations',
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const getProgressClass = () => {
    const ratio = course.enrolled / course.capacity;
    if (ratio >= 0.9) return 'progress-high';
    if (ratio >= 0.6) return 'progress-medium';
    return 'progress-low';
  };

  return (
    <div className="course-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span className={`badge ${isFull ? 'badge-full' : 'badge-available'}`}>
          {isFull ? 'Class Full' : 'Open'}
        </span>
        {course.semester && (
          <span style={{ fontSize: '0.7rem', color: '#6b7280', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            {course.semester}
          </span>
        )}
      </div>

      <h3>
        {course.code && <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 800 }}>{course.code}</span>}
        {course.title}
      </h3>
      <p className="description">{course.description}</p>

      <div className="meta">
        <div className="meta-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{course.instructor}</span>
        </div>
        <div className="meta-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{course.enrolled} / {course.capacity} enrolled</span>
        </div>
        {course.credits && (
          <div className="meta-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.credits} Credits</span>
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${getProgressClass()}`}
          style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
        />
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        {isAdmin ? (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Admin - manage in dashboard</span>
        ) : user ? (
          <button
            onClick={handleRegister}
            disabled={isFull || registering}
            className={isFull ? '' : 'btn-success'}
            style={{ background: isFull ? '#94a3b8' : undefined }}
          >
            {registering ? 'Registering...' : isFull ? 'Full' : 'Register Now'}
          </button>
        ) : (
          <button
            className="btn-primary-full"
            onClick={() => window.location.href = '/login'}
          >
            Login to Register
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;