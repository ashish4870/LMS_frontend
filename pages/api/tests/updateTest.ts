import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function updateTest(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body; 

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { testId, questionId, answer, score, difficulty } = req.body;
        if (!testId || !questionId || !answer || score === undefined || difficulty === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        console.log(
            testId, questionId, answer, score, difficulty, token
        )
        const response = await axios.post(
            `http://localhost:5000/api/tests/${testId}/update`,
            {
                questionId,
                answer,
                score,
                difficulty,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        // console.error('Error updating the test:', error);
        res.status(500).json({ message: 'Error updating the test' });
    }
}
