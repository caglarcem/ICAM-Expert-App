import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IcamCardProps {
  imageUrl: string;
  title: string;
  description: string;
  height: number;
}

const LandingPage: React.FC = () => {
  const [trialCode, setTrialCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const correctCode = 'iCAM-P@S5'; // Fixed trial code

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrialCode(event.target.value);
  };

  const handleButtonClick = () => {
    if (trialCode === correctCode) {
      setError('');
      navigate('/home');
    } else {
      setError('Invalid trial code. Please try again.');
    }
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} textAlign="center">
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Grid item>
                <img
                  src="/icam_expert_logo.svg"
                  alt="ICAM Expert Logo"
                  style={{ height: 50 }}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="h4"
                  component="div"
                  gutterBottom
                  sx={{ marginLeft: 1 }}
                >
                  ICAM EXPERT
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ marginY: 2 }} />
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontSize: 16 }}
            >
              Lead Investigator AI Assistant
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="body1" component="p">
              A sophisticated software tool designed to support professionals
              investigate and analyze mining accidents, helping to prevent
              future incidents.
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 8 }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={3}>
                <IcamCard
                  imageUrl="/incident-icon.svg"
                  title="Incident"
                  description="Incident requires data collection"
                  height={250}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <IcamCard
                  imageUrl="/evidence-icon.svg"
                  title="Evidence Collection"
                  description="ICAM expert helps with evidence collection and PEEPO generation"
                  height={250}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <IcamCard
                  imageUrl="/icam-icon.svg"
                  title="ICAM Analysis"
                  description="Built in tools help you work through step by step utilising latest generative AI to draft you ICAM analysis"
                  height={250}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <IcamCard
                  imageUrl="/report-icon.svg"
                  title="Review and Report"
                  description="ICAM Expert's outputs are easy to copy and paste to your ICAM report template to edit and finalise"
                  height={250}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <TextField
          label="Enter Trial Code"
          variant="outlined"
          value={trialCode}
          onChange={handleInputChange}
          sx={{ mb: 0, mt: 0, width: '250px', height: '60px' }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>
    </>
  );
};

const IcamCard: React.FC<IcamCardProps> = ({
  imageUrl,
  title,
  description,
  height,
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: height,
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          height: '100px',
          objectFit: 'contain',
        }}
      />
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LandingPage;
