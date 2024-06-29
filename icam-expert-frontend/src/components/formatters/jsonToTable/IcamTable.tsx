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
import React, { useEffect, useState } from 'react';

interface IcamData {
  Category: string;
  Evaluation: string;
}

interface IcamTableProps {
  text: string;
}

const IcamTable: React.FC<IcamTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<IcamData[]>([]);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): IcamData[] => {
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);

        return JSON.parse(jsonString);
      }
      return [];
    } catch (e) {
      console.log('JSON INPUT: ', text);
      console.error('Invalid JSON input', e);
      return [];
    }
  };

  return (
    <Box>
      {jsonData.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                  }}
                >
                  Evaluation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {data.Category}
                  </TableCell>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {data.Evaluation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default IcamTable;
