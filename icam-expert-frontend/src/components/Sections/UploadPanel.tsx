import {
  RemoveCircleOutline as RemoveIcon,
  UploadOutlined as UploadIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Tooltip,
  Typography,
} from '@mui/material';
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

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <input
        id="fileInput"
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
        accept=".pdf, .docx, .jpg, .jpeg, .mp4"
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
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}
          >
            <Typography
              variant="body2"
              sx={{ color: '#5c5c5c', flexGrow: 1 }}
              data-testid={`file-name-${index}`}
            >
              {file.name}
            </Typography>
            <Tooltip title="Remove">
              <IconButton
                edge="end"
                aria-label="remove"
                onClick={() => handleRemoveFile(index)}
                data-testid={`remove-file-button-${index}`}
              >
                <RemoveIcon sx={{ fontSize: '1.2rem', color: '#b30000' }} />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadPanel;
