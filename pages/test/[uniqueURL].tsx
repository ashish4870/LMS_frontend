import { useState } from 'react';
import { Container, Typography, Button, TextField, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import PrivateRoute from '@/components/PrivateRoute';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TestPage = () => {
  const [question, setQuestion] = useState<string>('');
  const [UIanswer, setUIanswer] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(0);
  const [questionId, setQuestionId] = useState<string>(''); 
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [scoreArray, setScoreArray] = useState<number[]>([]);
  const [difficultyArray, setDifficultyArray] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const router = useRouter();
  const { uniqueURL } = router.query;

  const getTestIdFromUniqueURL = () => {
    if (typeof uniqueURL === 'string') {
      const parts = uniqueURL.split('-');
      return parts.length > 0 ? parts[0] : null;
    }
    return null;
  };

  const fetchRandomQuestion = async () => {
    try {
      const response = await axios.get(`/api/question/getQuestion`);
      setQuestion(response.data.text);
      setQuestionId(response.data._id);
      setDifficulty(response.data.difficulty); 
      setAnswer(response.data.answer);
      setHasStarted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: any) => {
    const testId = getTestIdFromUniqueURL();

    if (!testId) {
      console.error('Test ID could not be extracted from uniqueURL');
      return;
    }

    try {
      let score = 0;
      if (answer == UIanswer) {
        score = 1;
      } else {
        score = 0;
      }

      const response = await axios.post(`/api/tests/updateTest`, {
        questionId,
        answer: UIanswer,
        difficulty,
        testId,
        score,
      });
      setTotalScore(response.data.totalScore);
      
      if (response.data.message === 'Test completed') {
        setIsTestCompleted(true);
        const testRes = await axios.post(`/api/tests/getTest`, {
          testId,
        });
        const scores = testRes.data.questions.map((q: any) => q.score);
        const difficulties = testRes.data.questions.map((q: any) => q.difficulty);
        
        setScoreArray(scores);
        setDifficultyArray(difficulties);
      } else {
        const nextQuestionDifficulty = response.data.nextQuestion.difficulty;

        if (nextQuestionDifficulty === 1 || nextQuestionDifficulty === 9) {

          setIsTestCompleted(true);
          const testRes = await axios.post(`/api/tests/getTest`, {
            testId,
          });
  
          const scores = testRes.data.questions.map((q: any) => q.score);
          const difficulties = testRes.data.questions.map((q: any) => q.difficulty);
          
          setScoreArray(scores);
          setDifficultyArray(difficulties);
        } else {
          setQuestion(response.data.nextQuestion.text);
          setQuestionId(response.data.nextQuestion._id);
          setDifficulty(nextQuestionDifficulty); 
          setHasStarted(true);
          setUIanswer('');
          setAnswer(response.data.nextQuestion.answer);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const graphData = {
    labels: difficultyArray,
    datasets: [
      {
        label: 'Score vs Difficulty',
        data: scoreArray,
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const graphOptions = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Score: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Difficulty'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Score'
        }
      }
    }
  };

  return (
    <PrivateRoute>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper elevation={6} sx={{ padding: '2rem', borderRadius: '10px', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {isTestCompleted ? (
              <>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                  Test Completed!
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}
                >
                  Your Total Score: {totalScore}
                </Typography>
                <Box sx={{ width: '100%', height: '400px' }}>
                  <Line data={graphData} options={graphOptions} />
                </Box>
              </>
            ) : hasStarted ? (
              question ? (
                <>
                  <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                  >
                    {question}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Your Answer"
                    value={UIanswer}
                    onChange={(e) => setUIanswer(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{
                      padding: '0.75rem 1.5rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                    }}
                  >
                    Submit Answer
                  </Button>
                </>
              ) : null
            ) : (
              <Button
                onClick={fetchRandomQuestion}
                variant="contained"
                color="primary"
                sx={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                Start Test
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </PrivateRoute>
  );
};

export default TestPage;
