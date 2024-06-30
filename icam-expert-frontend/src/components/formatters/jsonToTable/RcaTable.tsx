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

interface Rca {
  'Contributing Factor': string;
  'Certainty Rating': string;
  Explanation: string;
}

interface RcaTableProps {
  text: string;
}

const RcaTable: React.FC<RcaTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<Rca[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): Rca[] => {
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        let jsonString = text.substring(jsonStart, jsonEnd + 1);

        console.log('SANITIZED JSON STRING: ', jsonString);

        return JSON.parse(jsonString);
      }
      return [];
    } catch (e) {
      console.error('Invalid JSON input', e);
      return [];
    }
  };

  return (
    <Box>
      <CopyToClipboard tableRef={tableRef} />
      {jsonData.length > 0 && (
        <TableContainer component={Paper} ref={tableRef}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: 1,
                    lineHeight: 1.25,
                    fontWeight: 'bold',
                  }}
                >
                  Contributing Factor
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: 1,
                    lineHeight: 1.25,
                    fontWeight: 'bold',
                  }}
                >
                  Certainty Rating
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: 1,
                    lineHeight: 1.25,
                    fontWeight: 'bold',
                  }}
                >
                  Explanation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {data['Contributing Factor']}
                  </TableCell>
                  <TableCell
                    sx={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {data['Certainty Rating']}
                  </TableCell>
                  <TableCell
                    sx={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {data.Explanation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RcaTable;
