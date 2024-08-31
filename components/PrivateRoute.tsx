import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@mui/material';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user && !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  if (!user && !token) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
