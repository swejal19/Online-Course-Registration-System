const mongoose = require('mongoose');
const Course = require('./models/Course');

const courses = [
  {
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Fundamental concepts of programming, algorithms, and data structures. Perfect for beginners starting their coding journey.',
    instructor: 'Dr. Sarah Johnson',
    capacity: 35,
    enrolled: 0,
    credits: 3,
    semester: 'Fall 2024'
  },
  {
    code: 'MATH201',
    title: 'Advanced Mathematics',
    description: 'Calculus, linear algebra, and differential equations. Build a strong mathematical foundation for engineering and science.',
    instructor: 'Prof. Michael Chen',
    capacity: 30,
    enrolled: 0,
    credits: 4,
    semester: 'Fall 2024'
  },
  {
    code: 'CS301',
    title: 'Web Development with React',
    description: 'Learn modern frontend development using React, hooks, and state management. Build interactive web applications.',
    instructor: 'Emily Rodriguez',
    capacity: 25,
    enrolled: 0,
    credits: 3,
    semester: 'Fall 2024'
  },
  {
    code: 'DS401',
    title: 'Data Science and Machine Learning',
    description: 'Explore data analysis, visualization, and machine learning algorithms using Python and popular data science libraries.',
    instructor: 'Dr. James Wilson',
    capacity: 20,
    enrolled: 0,
    credits: 4,
    semester: 'Fall 2024'
  },
  {
    code: 'MKT201',
    title: 'Digital Marketing Strategy',
    description: 'Learn SEO, social media marketing, content strategy, and analytics to grow brands in the digital space.',
    instructor: 'Lisa Thompson',
    capacity: 40,
    enrolled: 0,
    credits: 3,
    semester: 'Fall 2024'
  },
  {
    code: 'ACC101',
    title: 'Financial Accounting',
    description: 'Master the fundamentals of financial reporting, balance sheets, income statements, and cash flow analysis.',
    instructor: 'Prof. Robert Brown',
    capacity: 30,
    enrolled: 0,
    credits: 3,
    semester: 'Fall 2024'
  },
  {
    code: 'DES201',
    title: 'UX/UI Design Fundamentals',
    description: 'Design user-centered interfaces with Figma, learn prototyping, wireframing, and user research techniques.',
    instructor: 'Amanda Lee',
    capacity: 25,
    enrolled: 0,
    credits: 3,
    semester: 'Fall 2024'
  },
  {
    code: 'CS401',
    title: 'Cloud Computing with AWS',
    description: 'Introduction to Amazon Web Services, deployment, serverless computing, and cloud architecture best practices.',
    instructor: 'David Kim',
    capacity: 20,
    enrolled: 0,
    credits: 3,
    semester: 'Fall 2024'
  }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/course-registration';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    await Course.insertMany(courses);
    console.log(`Added ${courses.length} sample courses`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();