import React, { ChangeEvent } from 'react';
import { Box, Button, Typography, Input, InputLabel } from '@mui/material';
import { UploadOutlined as UploadIcon } from '@mui/icons-material';
import { useFileContext } from '../../context/FileProvider';

const UploadPanel: React.FC = () => {
  const { files, setFiles } = useFileContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
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
            backgroundColor: '#008009',
            '&:hover': {
              backgroundColor: '#36A137',
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
          <Box sx={{ marginTop: '8px' }}>
            <Typography key={index} variant="body2" sx={{ color: '#5c5c5c' }}>
              {file.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadPanel;
