import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useFileContext } from '../../../context/FileProvider';

interface IcamToolsBaseProps {
  description: string;
  apiEndpoint: string;
}

const IcamToolsBaseComponent: React.FC<IcamToolsBaseProps> = ({
  description,
  apiEndpoint,
}) => {
  const { files } = useFileContext();
  const [reportResult, setReportResult] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select one or more files.');
      return;
    }

    setLoading(true);

    try {
      await queryDocuments(files);
    } finally {
      setLoading(false);
    }
  };

  const queryDocuments = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const apiBaseURL =
        process.env.REACT_APP_ICAM_API_URL ||
        `${window.location.protocol}//${window.location.host}/api`;

      const response = await axios.post(
        `${apiBaseURL}${apiEndpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setReportResult(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files.');
    }
  };

  return (
    <Box>
      <Typography
        sx={{ fontSize: '16px', color: '#666666' }}
        data-testid="description"
      >
        {description}
      </Typography>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}
      >
        <Button
          variant="contained"
          color="secondary"
          component="span"
          onClick={handleSubmit}
          disabled={files.length === 0 || loading}
          data-testid="submit-button"
        >
          SUBMIT
        </Button>
      </Box>
      <Box sx={{ marginTop: '16px' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress
              color="secondary"
              size="2rem"
              data-testid="loading-spinner"
            />
          </div>
        )}

        <Typography sx={{ marginTop: '32px' }} data-testid="report-result">
          {reportResult}
        </Typography>
      </Box>
    </Box>
  );
};

export default IcamToolsBaseComponent;
