import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Register for Courses Easily</h1>
          <p>
            Explore available classes, register with one click, and manage your
            academic schedule all in one place.
          </p>
          {!user && (
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Get Started
              </button>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="page-header">
        <h1>Available Courses</h1>
        <p>Browse our catalog and find the perfect courses for your semester</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3>No Courses Available</h3>
          <p>There are no courses available at the moment. Check back later or contact an admin.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} onUpdate={fetchCourses} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;