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

interface PeepoData {
  Category: string;
  Details: string;
  Other: string;
  RelevantData: string;
}

interface PeepoTableProps {
  text: string;
}

const PeepoTable: React.FC<PeepoTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<PeepoData[]>([]);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): PeepoData[] => {
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

  const renderColumnContents = (details: string) => {
    const items = details.split(',').map(item => item.trim());
    return (
      <ul
        style={{
          paddingInlineStart: '16px',
          marginBlockStart: '0px',
          marginBlockEnd: '0px',
        }}
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
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
                    fontWeight: 'bold',
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
                    fontWeight: 'bold',
                  }}
                >
                  Details
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                    fontWeight: 'bold',
                  }}
                >
                  Other
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                    fontWeight: 'bold',
                  }}
                >
                  Relevant Data to be Investigated
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
                    {renderColumnContents(data.Details)}
                  </TableCell>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {renderColumnContents(data.Other)}
                  </TableCell>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {renderColumnContents(data.RelevantData)}
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

export default PeepoTable;
