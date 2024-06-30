import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

interface TableProps {
  tableRef: React.RefObject<HTMLDivElement>;
}

const CopyToClipboard: React.FC<TableProps> = ({ tableRef }) => {
  const copyToClipboard = () => {
    const table = tableRef.current;
    if (table) {
      const range = document.createRange();
      range.selectNode(table);
      window.getSelection()?.removeAllRanges(); // clear current selection
      window.getSelection()?.addRange(range); // to select text
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges(); // to deselect
    }
  };

  return (
    <Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Tooltip title="Copy contents (Excel compatible)">
          <IconButton
            onClick={copyToClipboard}
            sx={{
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              '&:hover': {
                color: '#9c27b0',
              },
            }}
          >
            <Typography sx={{ fontSize: 'small', marginRight: '4px' }}>
              Copy table
            </Typography>
            <CopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CopyToClipboard;
