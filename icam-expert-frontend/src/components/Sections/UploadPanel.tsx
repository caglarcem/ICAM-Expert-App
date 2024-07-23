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

interface UploadPanelProps {
  settings: {
    state: string;
    mineType: string;
    commodity: string;
  };
  setSettings: (settings: {
    state: string;
    mineType: string;
    commodity: string;
  }) => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({ settings, setSettings }) => {
  const { files, setFiles } = useFileContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  return (
    <Box>
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
              color: '#0074a6', // Darker blue color
              '&:hover': {
                color: '#005174', // Darker shade on hover
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
                value={settings.state}
                onChange={e =>
                  setSettings({ ...settings, state: e.target.value as string })
                }
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
                <MenuItem value="Queensland" sx={{ fontSize: '0.85rem' }}>
                  QLD
                </MenuItem>
                <MenuItem
                  value="Northern Territory"
                  sx={{ fontSize: '0.85rem' }}
                >
                  NT
                </MenuItem>
                <MenuItem value="New South Wales" sx={{ fontSize: '0.85rem' }}>
                  NSW
                </MenuItem>
                <MenuItem value="Victoria" sx={{ fontSize: '0.85rem' }}>
                  VIC
                </MenuItem>
                <MenuItem value="South Australia" sx={{ fontSize: '0.85rem' }}>
                  SA
                </MenuItem>
                <MenuItem
                  value="Western Australia"
                  sx={{ fontSize: '0.85rem' }}
                >
                  WA
                </MenuItem>
                <MenuItem value="Tasmania" sx={{ fontSize: '0.85rem' }}>
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
              <InputLabel
                htmlFor="mine-type-select"
                sx={{ fontSize: '0.85rem' }}
              >
                Mine Type
              </InputLabel>
              <Select
                id="mine-type-select"
                value={settings.mineType}
                onChange={e =>
                  setSettings({
                    ...settings,
                    mineType: e.target.value as string,
                  })
                }
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
                <MenuItem value="open cut" sx={{ fontSize: '0.85rem' }}>
                  Open cut
                </MenuItem>
                <MenuItem value="underground" sx={{ fontSize: '0.85rem' }}>
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
              <InputLabel
                htmlFor="commodity-select"
                sx={{ fontSize: '0.85rem' }}
              >
                Commodity
              </InputLabel>
              <Select
                id="commodity-select"
                value={settings.commodity}
                onChange={e =>
                  setSettings({
                    ...settings,
                    commodity: e.target.value as string,
                  })
                }
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
                <MenuItem value="coal" sx={{ fontSize: '0.85rem' }}>
                  Coal
                </MenuItem>
                <MenuItem value="metal" sx={{ fontSize: '0.85rem' }}>
                  Metal
                </MenuItem>
                <MenuItem value="quarry" sx={{ fontSize: '0.85rem' }}>
                  Quarry
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
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
    </Box>
  );
};

export default UploadPanel;
