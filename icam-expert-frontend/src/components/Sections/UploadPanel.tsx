import { UploadOutlined as UploadIcon } from '@mui/icons-material';
import { Box, Button, InputLabel, Typography } from '@mui/material';
import React, { ChangeEvent } from 'react';
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
      <input
        id="fileInput"
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
        multiple
        data-testid="file-input"
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
          data-testid="select-files-button"
        >
          Select Files
        </Button>
      </InputLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
        {files.map((file, index) => (
          <Box key={index} sx={{ marginTop: '8px' }}>
            <Typography
              variant="body2"
              sx={{ color: '#5c5c5c' }}
              data-testid={`file-name-${index}`}
            >
              {file.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadPanel;
