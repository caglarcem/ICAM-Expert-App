import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: '16px',
          color: '#666666',
          textAlign: 'center',
          marginTop: 2,
        }}
        data-testid="description"
      >
        Pick your tool, select the documents/files relevant to the incident and
        submit.
        <br />
        <br />
        ICAM Expert supports the majority of the text, pdf, document, audio and
        video file types.
      </Typography>
      <Container
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          height: '100vh',
          width: '670px',
          marginTop: 16,
        }}
      >
        <Box
          component="img"
          src="/icam-workflow.png"
          alt="ICAM Workflow"
          sx={{
            width: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </Container>
    </>
  );
};

export default Home;
