const express = require('express');
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register for course
router.post('/', auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.enrolled >= course.capacity) return res.status(400).json({ message: 'Course full' });

    const existing = await Registration.findOne({ student: req.user.id, course: courseId });
    if (existing) return res.status(400).json({ message: 'Already registered' });

    const registration = new Registration({ student: req.user.id, course: courseId });
    await registration.save();

    course.enrolled += 1;
    await course.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's registrations
router.get('/my', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user.id }).populate('course');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Drop a course
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findOne({ _id: req.params.id, student: req.user.id });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    const course = await Course.findById(registration.course);
    if (course) {
      course.enrolled = Math.max(0, course.enrolled - 1);
      await course.save();
    }

    await registration.deleteOne();
    res.json({ message: 'Course dropped successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;