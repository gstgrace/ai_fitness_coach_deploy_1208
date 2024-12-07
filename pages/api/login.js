import bcrypt from 'bcryptjs';
import clientPromise from '../../utils/mongodb';
import jwt from 'jsonwebtoken';

// Login API Route
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('fitnessDB');

    // Find the user by email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password. Please check your credentials.' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password. Please check your credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Error occurred during login:", error);
    return res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
}
