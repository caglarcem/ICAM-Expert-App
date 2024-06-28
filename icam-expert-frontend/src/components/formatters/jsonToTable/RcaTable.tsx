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

interface ContributingFactor {
  'Contributing Factor': string;
  'Certainty Rating': string;
  Explanation: string;
}

interface IcamTableProps {
  text: string;
}

const RcaTable: React.FC<IcamTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<ContributingFactor[][]>([]);

  useEffect(() => {
    const parsedData = sanitizeAndParseJson(text);
    setJsonData(parsedData);
  }, [text]);

  const sanitizeAndParseJson = (text: string): ContributingFactor[][] => {
    try {
      const jsonParts = text.match(/\[.*?\]/g);

      if (!jsonParts) {
        throw new Error('No JSON arrays found in the text');
      }

      const parsedArrays = jsonParts.map(jsonPart => {
        const sanitizedJsonPart = jsonPart.replace(/'/g, '"');
        return JSON.parse(sanitizedJsonPart);
      });

      return parsedArrays;
    } catch (e) {
      console.error('Invalid JSON input', e);
      return [];
    }
  };

  return (
    <Box>
      {jsonData.length > 0 &&
        jsonData.map(
          (tableData, index) =>
            Array.isArray(tableData) && (
              <TableContainer
                key={index}
                component={Paper}
                sx={{ marginTop: 2, marginBottom: 4 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #ddd',
                          padding: 1,
                          lineHeight: 1.25,
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
                        }}
                      >
                        Explanation
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((data, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell
                          sx={{
                            border: '1px solid #ddd',
                            verticalAlign: 'top',
                          }}
                        >
                          {data['Contributing Factor']}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: '1px solid #ddd',
                            verticalAlign: 'top',
                          }}
                        >
                          {data['Certainty Rating']}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: '1px solid #ddd',
                            verticalAlign: 'top',
                          }}
                        >
                          {data['Explanation']}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
        )}
    </Box>
  );
};

export default RcaTable;
