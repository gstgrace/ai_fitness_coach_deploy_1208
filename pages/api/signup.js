import bcrypt from 'bcryptjs';
import clientPromise from '../../utils/mongodb';

// Sign Up API Route
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

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
  } catch (error) {
    console.error("Error occurred during signup:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
