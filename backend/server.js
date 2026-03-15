const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const Course = require('./models/Course');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedDefaultData = async () => {
  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    await Course.insertMany([
      {
        title: 'Introduction to Computer Science',
        description: 'Learn the fundamentals of computer science using problem-solving and algorithms.',
        instructor: 'Dr. Ada Lovelace',
        capacity: 40
      },
      {
        title: 'Web Development Basics',
        description: 'Build your first websites using HTML, CSS, and JavaScript.',
        instructor: 'Prof. Grace Hopper',
        capacity: 35
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Explore core data structures and algorithmic thinking for efficient code.',
        instructor: 'Dr. Donald Knuth',
        capacity: 30
      }
    ]);
    console.log('Seeded default courses');
  }

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@college.edu',
      password: hashed,
      role: 'admin'
    });
    console.log('Seeded default admin user (admin@college.edu / admin123)');
  }
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/course-registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');
  await seedDefaultData();
}).catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/registrations', require('./routes/registrations'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));