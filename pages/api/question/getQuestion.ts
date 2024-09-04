import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  try {
    const response = await axios.get(`http://localhost:5000/api/questions/random`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching test details:', error);
    res.status(500).json({ message: 'Error fetching test details' });
  }
}
