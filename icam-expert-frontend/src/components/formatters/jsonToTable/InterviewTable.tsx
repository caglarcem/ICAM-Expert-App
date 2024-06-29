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
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);

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
    <Box data-testid="interview-response-table" sx={{ marginTop: 6 }}>
      {jsonData.length > 0 && (
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
                  Name
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
                    <ul
                      style={{
                        paddingInlineStart: '16px',
                        marginBlockStart: '0px',
                        marginBlockEnd: '0px',
                      }}
                    >
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
      {jsonData.length === 0 && <></>}
    </Box>
  );
};

export default InterviewTable;
