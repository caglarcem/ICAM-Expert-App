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

interface TimelineData {
  DateTime: string[];
  Event: string[];
  Reason1: string[];
  Reason2: string[];
  Reason3: string[];
  Reason4: string[];
  Reason5: string[];
}

interface TimelineTableProps {
  text: string;
}

const TimelineTable: React.FC<TimelineTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<TimelineData>({
    DateTime: [],
    Event: [],
    Reason1: [],
    Reason2: [],
    Reason3: [],
    Reason4: [],
    Reason5: [],
  });

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): TimelineData => {
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);

        console.log('SANITIZED JSON: ', jsonString);

        return JSON.parse(jsonString);
      }
      return {
        DateTime: [],
        Event: [],
        Reason1: [],
        Reason2: [],
        Reason3: [],
        Reason4: [],
        Reason5: [],
      };
    } catch (e) {
      console.log('JSON INPUT: ', text);
      console.error('Invalid JSON input', e);
      return {
        DateTime: [],
        Event: [],
        Reason1: [],
        Reason2: [],
        Reason3: [],
        Reason4: [],
        Reason5: [],
      };
    }
  };

  const getRowCount = (): number => {
    return Math.max(
      jsonData.DateTime.length,
      jsonData.Event.length,
      jsonData.Reason1.length,
      jsonData.Reason2.length,
      jsonData.Reason3.length,
      jsonData.Reason4.length,
      jsonData.Reason5.length
    );
  };

  return (
    <Box>
      {Object.keys(jsonData).length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(jsonData).map((key, index) => (
                  <TableCell
                    key={index}
                    style={{
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      padding: '8px',
                      lineHeight: '1.25',
                    }}
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: getRowCount() }).map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  style={{
                    backgroundColor: rowIndex === 0 ? '#f0f0f0' : 'white',
                  }}
                >
                  {Object.keys(jsonData).map((key, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                    >
                      {jsonData[key as keyof TimelineData][rowIndex] || '-'}
                    </TableCell>
                  ))}
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

export default TimelineTable;
