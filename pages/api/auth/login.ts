import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: req.body.email,
        password: req.body.password
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
}
