import React, { ChangeEvent, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';

const Interview: React.FC = () => {
  const [files, setSelectedFiles] = useState<File[]>([]);
  const [reportResult, setReportResult] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(selectedFiles);
      setReportResult(undefined);
    }
  };

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
        `${apiBaseURL}/queryDocuments/report?tool=generate-follow-up-interview-questions`,
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
      <Typography sx={{ fontSize: '16px', color: '#666666' }}>
        Generates follow up interview questions based on the event debrief,
        witness statements and other provided documents. Select Files and press
        submit.
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
        >
          SUBMIT
        </Button>
      </Box>
    </Box>
  );
};

export default Interview;
