import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

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

  return (
    <Box sx={{ marginTop: 6 }}>
      {Object.keys(jsonData).length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableBody>
              {Object.keys(jsonData).map((key, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index === 0 ? '#f0f0f0' : 'white',
                  }}
                >
                  <TableCell
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px',
                      lineHeight: '1.25',
                      fontWeight: index === 0 ? 'bold' : 'normal',
                    }}
                  >
                    {key}
                  </TableCell>
                  {jsonData[key as keyof TimelineData].map((value, idx) => (
                    <TableCell
                      key={idx}
                      style={{
                        border: '1px solid #ddd',
                        verticalAlign: 'top',
                        fontWeight: index === 0 ? 'bold' : 'normal',
                      }}
                    >
                      {value}
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
