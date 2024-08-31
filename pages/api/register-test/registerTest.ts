import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function registerTest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;
    const response = await axios.post('http://localhost:5000/api/tests', { userId });
    res.status(201).json(response.data);
  } catch (error) {
    // console.error('Error registering for the test:', error);
    res.status(500).json({ message: 'Error registering for the test' });
  }
}
