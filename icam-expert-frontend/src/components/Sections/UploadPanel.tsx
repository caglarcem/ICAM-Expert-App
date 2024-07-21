import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  RemoveCircleOutline as RemoveIcon,
  Settings as SettingsIcon,
  UploadOutlined as UploadIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { useFileContext } from '../../context/FileProvider';

const UploadPanel: React.FC = () => {
  const { files, setFiles } = useFileContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [state, setState] = useState('QLD'); // Default to QLD
  const [mineType, setMineType] = useState('Open cut'); // Default to Open cut
  const [commodity, setCommodity] = useState('Coal'); // Default to Coal

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const viewerFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.tiff'];
  const audioFileTypes = ['.wav', '.ogg', '.mp3', '.flac', '.amr'];
  const videoFileTypes = [
    '.mp4',
    '.avi',
    '.mkv',
    '.mov',
    '.flv',
    '.wmv',
    '.webm',
    '.mpeg',
    '.mpg',
    '.3gp',
    '.ogv',
  ];

  const combinedFileTypes = [
    ...viewerFileTypes,
    ...audioFileTypes,
    ...videoFileTypes,
  ].join(', ');

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const fixedWidth = 250; // Set a fixed width for the elements

  const Settings: React.FC = () => (
    <Box sx={{ padding: 2, paddingBottom: 0, width: fixedWidth }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 1,
          width: '100%',
        }}
      >
        <Button
          onClick={handleSettingsClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textTransform: 'none',
            padding: 0,
            fontSize: '0.875rem',
            color: '#003366', // Darker blue color
            '&:hover': {
              color: '#002244', // Darker shade on hover
            },
            width: '100%',
          }}
        >
          <SettingsIcon sx={{ marginRight: 1 }} />
          <Typography variant="body1">Settings</Typography>
          {isSettingsOpen ? (
            <ExpandLessIcon sx={{ marginLeft: 'auto' }} />
          ) : (
            <ExpandMoreIcon sx={{ marginLeft: 'auto' }} />
          )}
        </Button>
      </Box>
      {isSettingsOpen && (
        <Box sx={{ marginBottom: 1, width: '100%' }}>
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 1, marginTop: 1 }}
          >
            <InputLabel htmlFor="state-select" sx={{ fontSize: '0.85rem' }}>
              State
            </InputLabel>
            <Select
              id="state-select"
              value={state}
              onChange={e => setState(e.target.value as string)}
              label="State"
              sx={{ fontSize: '0.85rem' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    fontSize: '0.85rem',
                    width: 200,
                  },
                },
              }}
            >
              <MenuItem value="QLD" sx={{ fontSize: '0.85rem' }}>
                QLD
              </MenuItem>
              <MenuItem value="NT" sx={{ fontSize: '0.85rem' }}>
                NT
              </MenuItem>
              <MenuItem value="NSW" sx={{ fontSize: '0.85rem' }}>
                NSW
              </MenuItem>
              <MenuItem value="VIC" sx={{ fontSize: '0.85rem' }}>
                VIC
              </MenuItem>
              <MenuItem value="SA" sx={{ fontSize: '0.85rem' }}>
                SA
              </MenuItem>
              <MenuItem value="WA" sx={{ fontSize: '0.85rem' }}>
                WA
              </MenuItem>
              <MenuItem value="TAS" sx={{ fontSize: '0.85rem' }}>
                TAS
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginBottom: 1, marginTop: 1 }}
          >
            <InputLabel htmlFor="mine-type-select" sx={{ fontSize: '0.85rem' }}>
              Mine Type
            </InputLabel>
            <Select
              id="mine-type-select"
              value={mineType}
              onChange={e => setMineType(e.target.value as string)}
              label="Mine Type"
              sx={{ fontSize: '0.85rem' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    fontSize: '0.85rem',
                    width: 200,
                  },
                },
              }}
            >
              <MenuItem value="Open cut" sx={{ fontSize: '0.85rem' }}>
                Open cut
              </MenuItem>
              <MenuItem value="Underground" sx={{ fontSize: '0.85rem' }}>
                Underground
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginTop: 1 }}
          >
            <InputLabel htmlFor="commodity-select" sx={{ fontSize: '0.85rem' }}>
              Commodity
            </InputLabel>
            <Select
              id="commodity-select"
              value={commodity}
              onChange={e => setCommodity(e.target.value as string)}
              label="Commodity"
              sx={{ fontSize: '0.85rem' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    fontSize: '0.85rem',
                    width: 200,
                  },
                },
              }}
            >
              <MenuItem value="Coal" sx={{ fontSize: '0.85rem' }}>
                Coal
              </MenuItem>
              <MenuItem value="Metal" sx={{ fontSize: '0.85rem' }}>
                Metal
              </MenuItem>
              <MenuItem value="Quarry" sx={{ fontSize: '0.85rem' }}>
                Quarry
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );

  const SelectFiles: React.FC = () => (
    <Box sx={{ padding: 2, width: fixedWidth }}>
      <input
        id="fileInput"
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
        accept={combinedFileTypes}
        multiple
        data-testid="file-input"
      />
      <InputLabel htmlFor="fileInput" sx={{ width: '100%' }}>
        <Button
          sx={{
            backgroundColor: '#008009',
            '&:hover': {
              backgroundColor: '#36A137',
            },
            marginTop: 0,
            width: '100%',
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

  return (
    <Box>
      <Settings />
      <SelectFiles />
    </Box>
  );
};

export default UploadPanel;
