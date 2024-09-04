import { Button, Typography, Container, Box, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import PrivateRoute from '../components/PrivateRoute';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const HomePage = () => {
  const router = useRouter();
  const { user, token } = useAuth();

  const handleRegisterAndStartTest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/register-test/registerTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, token }),
      });

      if (!response.ok) {
        throw new Error('Failed to register for the test');
      }

      const data = await response.json();
      console.log('Test registered:', data);
      router.push(`/${data.uniqueURL}`); 
    } catch (error) {
      console.error('Failed to register for the test:', error);
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
        <Paper elevation={6} sx={{ padding: '3rem', borderRadius: '10px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              Welcome to the LMS
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mb: 3 }}
            >
              Ready to test your knowledge? Register and start the adaptive test now!
            </Typography>
            <Button
              onClick={handleRegisterAndStartTest}
              variant="contained"
              color="primary"
              sx={{
                padding: '0.75rem 1.5rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Register & Start Test
            </Button>
          </Box>
        </Paper>
      </Container>
    </PrivateRoute>
  );
};

export default HomePage;
