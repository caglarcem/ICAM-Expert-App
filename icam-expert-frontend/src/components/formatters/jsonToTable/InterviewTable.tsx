import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';

interface FollowupInterview {
  Name: string;
  Questions: string[];
}

interface InterviewTableProps {
  text: string;
}

const InterviewTable: React.FC<InterviewTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<FollowupInterview[]>([]);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): FollowupInterview[] => {
    try {
      // Remove escape characters and anything outside the JSON array
      const sanitizedText = text.replace(/[^\x20-\x7E]+/g, '').trim();
      const jsonStart = sanitizedText.indexOf('[');
      const jsonEnd = sanitizedText.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = sanitizedText.substring(jsonStart, jsonEnd + 1);

        const jsonObject = JSON.parse(jsonString);

        return jsonObject;
      }
      return [];
    } catch (e) {
      console.error('Invalid JSON input');
      return [];
    }
  };

  return (
    <Box>
      {jsonData.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#f0f0f0' }}>
                  Name
                </TableCell>
                <TableCell style={{ backgroundColor: '#f0f0f0' }}>
                  Questions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonData.map((person, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    {person.Name}
                  </TableCell>
                  <TableCell
                    style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                  >
                    <ul style={{ paddingInlineStart: '16px' }}>
                      {person.Questions?.map((question, qIndex) => (
                        <li key={qIndex}>{question}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {jsonData.length === 0 && (
        <Typography variant="body1" align="center">
          No data available
        </Typography>
      )}
    </Box>
  );
};

export default InterviewTable;
