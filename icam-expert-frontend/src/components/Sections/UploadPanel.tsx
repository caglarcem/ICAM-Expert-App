import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Typography, Input, InputLabel } from '@mui/material';
import { UploadOutlined as UploadIcon } from '@mui/icons-material';

const UploadPanel: React.FC = () => {
  const [files, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Input
        id="fileInput"
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
        inputProps={{ multiple: true, accept: '.pdf' }}
      />
      <InputLabel htmlFor="fileInput">
        <Button
          sx={{
            backgroundColor: '#36A137',
            '&:hover': {
              backgroundColor: '#008009',
            },
          }}
          variant="contained"
          component="span"
          startIcon={<UploadIcon />}
        >
          Select Files
        </Button>
      </InputLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
        {files.map((file, index) => (
          <Typography key={index} variant="body2" sx={{ color: '#5c5c5c' }}>
            {file.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default UploadPanel;
