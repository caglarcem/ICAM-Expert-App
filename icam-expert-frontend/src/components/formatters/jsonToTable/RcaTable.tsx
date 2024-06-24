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
} from '@mui/material';

interface Explanation {
  contributingFactor: string;
  certaintyRating: number;
  explanation: string;
}

interface RootCause {
  rootCause: string;
  summary: string;
  explanation: Explanation[];
}

interface RcaData {
  'Root Causes': RootCause[];
}

interface RcaTableProps {
  text: string;
}

const RcaTable: React.FC<RcaTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<RcaData | null>(null);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): RcaData | null => {
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      }
      return null;
    } catch (e) {
      console.log('JSON INPUT: ', text);
      console.error('Invalid JSON input', e);
      return null;
    }
  };

  return (
    <Box>
      {jsonData && jsonData['Root Causes'].length > 0 ? (
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
                  Root Cause
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                  }}
                >
                  Summary
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                  }}
                >
                  Explanation
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    padding: '8px',
                    lineHeight: '1.25',
                  }}
                >
                  Certainty Rating
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonData['Root Causes'].map((rootCause, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell
                      rowSpan={rootCause.explanation.length}
                      style={{
                        border: '1px solid #ddd',
                        verticalAlign: 'top',
                      }}
                    >
                      {rootCause.rootCause}
                    </TableCell>
                    <TableCell
                      rowSpan={rootCause.explanation.length}
                      style={{
                        border: '1px solid #ddd',
                        verticalAlign: 'top',
                      }}
                    >
                      {rootCause.summary}
                    </TableCell>
                    <TableCell
                      style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                    >
                      {rootCause.explanation[0].contributingFactor}
                    </TableCell>
                    <TableCell
                      style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                    >
                      {rootCause.explanation[0].certaintyRating}%
                    </TableCell>
                  </TableRow>
                  {rootCause.explanation.slice(1).map((exp, expIndex) => (
                    <TableRow key={expIndex}>
                      <TableCell
                        style={{
                          border: '1px solid #ddd',
                          verticalAlign: 'top',
                        }}
                      >
                        {exp.contributingFactor}
                      </TableCell>
                      <TableCell
                        style={{
                          border: '1px solid #ddd',
                          verticalAlign: 'top',
                        }}
                      >
                        {exp.certaintyRating}%
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
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

export default RcaTable;
