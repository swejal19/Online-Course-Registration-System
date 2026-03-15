import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyCourses = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseToDrop, setCourseToDrop] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/registrations/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const handleDropClick = (reg) => {
    setCourseToDrop(reg);
    setShowModal(true);
  };

  const confirmDrop = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/registrations/${courseToDrop._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(registrations.filter(reg => reg._id !== courseToDrop._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to drop course');
    } finally {
      setShowModal(false);
      setCourseToDrop(null);
    }
  };

  // Filter out registrations where course is deleted
  const validRegistrations = registrations.filter(reg => reg.course !== null);

  return (
    <div>
      <div className="page-header">
        <h1>My Registered Courses</h1>
        <p>View and manage your enrolled courses for this semester</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : validRegistrations.length === 0 ? (
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3>No Courses Yet</h3>
          <p>You haven't registered for any courses. Browse our catalog to get started!</p>
          <a href="/" className="btn btn-primary-full" style={{ maxWidth: '200px', margin: '0 auto' }}>
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="course-grid">
          {validRegistrations.map(reg => (
            <div className="course-card" key={reg._id}>
              <span className="badge badge-registered">Enrolled</span>
              <h3>{reg.course?.title || 'Course'}</h3>
              <p className="description">{reg.course?.description || ''}</p>
              <div className="meta">
                <div className="meta-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{reg.course?.instructor || 'N/A'}</span>
                </div>
                <div className="meta-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Registered on {new Date(reg.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="actions">
                <button className="btn-danger" onClick={() => handleDropClick(reg)}>
                  Drop Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Drop Course?</h3>
            <p>Are you sure you want to drop "{courseToDrop?.course?.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDrop}>Drop Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;