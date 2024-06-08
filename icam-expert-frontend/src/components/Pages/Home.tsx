import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Grid,
  Typography,
  Input,
  Stack,
  InputLabel,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { UploadOutlined as UploadIcon } from '@mui/icons-material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [files, setSelectedFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [reportResult, setReportResult] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(selectedFiles);
      setReportResult(undefined);
    }
  };

  const handleOptionChange = (e: SelectChangeEvent<string>) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select one or more files.');
      return;
    }

    if (!selectedOption) {
      alert('Please select a query option.');
      return;
    }

    setLoading(true);

    try {
      await queryDocuments(selectedOption, files);
    } finally {
      setLoading(false);
    }
  };

  const queryDocuments = async (tool: string, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const apiBaseURL =
        process.env.REACT_APP_ICAM_API_URL ||
        `${window.location.protocol}//${window.location.host}/api`;

      console.log('API base url: ', apiBaseURL);

      const response = await axios.post(
        `${apiBaseURL}/queryDocuments/report?tool=${tool}`,
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
    <div>
      <Stack
        spacing={4}
        style={{
          maxWidth: '800px',
          width: '100%',
          margin: 'auto',
          marginTop: '10px',
        }}
      >
        <Typography
          style={{
            fontSize: '24px',
            marginTop: '50px',
            color: '#F9BF90',
            fontWeight: '400',
          }}
        >
          ICAM Expert
        </Typography>

        <Container>
          <Typography style={{ fontSize: '16px' }} gutterBottom>
            Please select the PDF documents and choose your tool.
          </Typography>
          <Typography style={{ fontSize: '16px' }} gutterBottom>
            The result will be generated based on the information in all
            documents holistically.
          </Typography>
        </Container>

        <Input
          id="fileInput"
          style={{ display: 'none' }}
          type="file"
          onChange={handleFileChange}
          inputProps={{ multiple: true, accept: '.pdf' }}
        />
        <InputLabel htmlFor="fileInput">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
          >
            Select Files
          </Button>
        </InputLabel>

        <Box style={{ display: 'flex', color: '#90caf9' }}>
          {files.map((file, index) => (
            <Grid item key={index} style={{ marginRight: '16px' }}>
              {file.name}
            </Grid>
          ))}
        </Box>

        <FormControl
          fullWidth
          style={{
            marginTop: '20px',
            width: '100%',
            maxWidth: '450px',
            margin: '0 auto',
          }}
        >
          <Select
            value={selectedOption}
            onChange={handleOptionChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ marginTop: '60px' }}
          >
            <MenuItem value="" disabled>
              Select the Tool
            </MenuItem>
            <MenuItem value="generate-follow-up-interview-questions">
              Generate Follow up Interview Questions
            </MenuItem>
            <MenuItem value="brief-description-of-the-event">
              Brief description of the Event
            </MenuItem>
            <MenuItem value="peepo-builder">PEEPO Builder</MenuItem>
            <MenuItem value="timeline-builder">Timeline Builder</MenuItem>
            <MenuItem value="icam-analysis">ICAM Analysis</MenuItem>
            <MenuItem value="contributing-factors-analysis">
              Contributing Factors Analysis
            </MenuItem>
            <MenuItem value="root-cause-analysis">Root Cause Analysis</MenuItem>
            <MenuItem value="key-learnings">Key Learnings</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          component="span"
          style={{ width: 'fit-content', margin: '40px auto' }}
          onClick={handleSubmit}
          disabled={files.length === 0 || !selectedOption || loading}
        >
          SUBMIT
        </Button>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="secondary" />
          </div>
        )}

        <Typography>{reportResult}</Typography>
      </Stack>
    </div>
  );
};

export default Home;
