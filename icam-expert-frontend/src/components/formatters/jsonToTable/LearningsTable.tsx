import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CopyToClipboard from '../../common/CopyToClipboard';

interface DataItem {
  'Contributing Factor': string;
  Action: string;
  Description: string;
}

interface LearningTableProps {
  text: string;
}

const LearningsTable: React.FC<LearningTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<DataItem[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        const jsonObject = JSON.parse(jsonString);

        setJsonData(jsonObject);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setJsonData([]);
    }
  }, [text]);

  return (
    <Box sx={{ margin: 'auto', marginTop: '40px', maxWidth: '800px' }}>
      <CopyToClipboard tableRef={tableRef} />
      <TableContainer
        component={Paper}
        ref={tableRef}
        id="learning-table"
        sx={{ mt: 1 }}
      >
        <Table aria-label="learnings table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  border: '1px solid #ddd',
                  backgroundColor: '#f0f0f0',
                  width: '25%',
                }}
              >
                Contributing Factor
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  border: '1px solid #ddd',
                  backgroundColor: '#f0f0f0',
                  width: '15%',
                }}
              >
                Action
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  border: '1px solid #ddd',
                  backgroundColor: '#f0f0f0',
                  width: '60%',
                }}
              >
                Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jsonData.map((item: DataItem, index: number) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {index === 0 ||
                    item['Contributing Factor'] !==
                      jsonData[index - 1]['Contributing Factor']
                      ? item['Contributing Factor']
                      : ''}
                  </TableCell>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {item.Action}
                  </TableCell>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {item.Description}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LearningsTable;
