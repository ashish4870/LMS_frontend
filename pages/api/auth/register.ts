import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request Body:', req.body);

    const response = await axios.post('http://localhost:5000/api/auth/register', 
        {
            username: req.body.email,
            password: req.body.password
        }, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });

    console.log('Response from API:', response.data);
    res.status(200).json({ message: 'Registration successful', data: response.data });
  } catch (error: any) {
    console.error('Error Response Data:', error.response ? error.response.data : 'No response data');
    console.error('Error Response Status:', error.response ? error.response.status : 'No response status');
    console.error('Error Response Headers:', error.response ? error.response.headers : 'No response headers');
    res.status(500).json({ message: 'Error registering', error: error.message });
  }
}
