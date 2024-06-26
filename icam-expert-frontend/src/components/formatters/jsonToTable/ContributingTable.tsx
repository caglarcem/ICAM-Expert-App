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

interface ContributingData {
  ContributingFactor: string;
  CertaintyRating: string;
  Explanation: string;
}

interface ContributingTableProps {
  text: string;
}

const ContributingTable: React.FC<ContributingTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<ContributingData[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): ContributingData[] => {
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
    <Box sx={{ marginTop: 6 }}>
      {jsonData.length > 0 ? (
        <>
          <CopyToClipboard tableRef={tableRef} />
          <TableContainer
            component={Paper}
            ref={tableRef}
            id="contributing-table"
            style={{ marginTop: 20 }}
          >
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
                    Contributing Factor
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
                    Certainty Rating
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
                    Explanation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jsonData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                    >
                      {data.ContributingFactor}
                    </TableCell>
                    <TableCell
                      style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                    >
                      {data.CertaintyRating}
                    </TableCell>
                    <TableCell
                      style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                    >
                      {data.Explanation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ContributingTable;
