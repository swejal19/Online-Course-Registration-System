import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [credits, setCredits] = useState('');
  const [semester, setSemester] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem('token');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/courses',
        {
          title,
          description,
          instructor,
          capacity: Number(capacity),
          credits: Number(credits),
          semester,
          code
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Reset form
      setTitle('');
      setDescription('');
      setInstructor('');
      setCapacity('');
      setCredits('3');
      setSemester('Fall 2024');
      setCode('');
      fetchCourses();
      alert('Course added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setShowModal(false);
      setCourseToDelete(null);
    }
  };

  // Calculate stats
  const totalStudents = courses.reduce((sum, c) => sum + c.enrolled, 0);
  const totalCapacity = courses.reduce((sum, c) => sum + c.capacity, 0);
  const fullCourses = courses.filter(c => c.enrolled >= c.capacity).length;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage courses and monitor student registrations</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Courses</h4>
          <div className="value">{courses.length}</div>
        </div>
        <div className="stat-card">
          <h4>Total Students</h4>
          <div className="value">{totalStudents}</div>
        </div>
        <div className="stat-card">
          <h4>Available Seats</h4>
          <div className="value">{totalCapacity - totalStudents}</div>
        </div>
        <div className="stat-card">
          <h4>Full Courses</h4>
          <div className="value">{fullCourses}</div>
        </div>
      </div>

      <div className="admin-section">
        {/* Add Course Form */}
        <div className="admin-form">
          <h2>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Course
          </h2>
          <form onSubmit={handleAddCourse}>
            <div className="form-group">
              <label htmlFor="code">Course Code</label>
              <input
                id="code"
                type="text"
                placeholder="e.g., CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Course Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Course description and details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="instructor">Instructor</label>
                <input
                  id="instructor"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="credits">Credits</label>
                <select
                  id="credits"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                >
                  <option value="1">1 Credit</option>
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="capacity">Student Capacity</label>
                <input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 30"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                  min={1}
                />
              </div>
              <div className="form-group">
                <label htmlFor="semester">Semester</label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2025">Spring 2025</option>
                  <option value="Summer 2025">Summer 2025</option>
                  <option value="Fall 2025">Fall 2025</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary-full" disabled={loading}>
              {loading ? 'Adding Course...' : 'Add Course'}
            </button>
          </form>
        </div>

        {/* Course List */}
        <div className="admin-courses">
          <h2>Existing Courses ({courses.length})</h2>
          {fetching ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3>No Courses Yet</h3>
              <p>Add your first course using the form on the left.</p>
            </div>
          ) : (
            <div className="course-grid">
              {courses.map(course => (
                <div className="course-card" key={course._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className={`badge ${course.enrolled >= course.capacity ? 'badge-full' : 'badge-available'}`}>
                      {course.enrolled >= course.capacity ? 'Full' : `${course.capacity - course.enrolled} spots left`}
                    </span>
                    {course.semester && (
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        {course.semester}
                      </span>
                    )}
                  </div>
                  <h3>{course.code && <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>{course.code}</span>}{course.title}</h3>
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
                      <span>{course.enrolled} / {course.capacity} students</span>
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
                      className={`progress-bar-fill ${course.enrolled / course.capacity >= 0.9 ? 'progress-high' : course.enrolled / course.capacity >= 0.6 ? 'progress-medium' : 'progress-low'}`}
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    />
                  </div>
                  <div className="actions" style={{ marginTop: '1rem' }}>
                    <button className="btn-danger" onClick={() => handleDeleteClick(course)}>
                      Delete Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Course?</h3>
            <p>Are you sure you want to delete "{courseToDelete?.title}"? This will remove all student registrations. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;