import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface DataItem {
  'Contributing Factor': string;
  Action: string;
  Description: string;
}

interface LearningTableProps {
  text: string;
}

const LearningsTable: React.FC<LearningTableProps> = ({ text }) => {
  const [jsonData, setJsonData] = useState<DataItem[]>([]);

  useEffect(() => {
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);

        console.log('JSON STRING:', jsonString);
        const jsonObject = JSON.parse(jsonString);

        console.log('JSON OBJECT:', jsonObject);
        setJsonData(jsonObject);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setJsonData([]);
    }
  }, [text]);

  return (
    <TableContainer
      component={Paper}
      style={{ maxWidth: '800px', margin: 'auto', marginTop: '40px' }}
    >
      <Table aria-label="learnings table">
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                fontWeight: 'bold',
                border: '1px solid #ddd',
                backgroundColor: '#f0f0f0',
                width: '25%',
              }}
            >
              Contributing Factor
            </TableCell>
            <TableCell
              style={{
                fontWeight: 'bold',
                border: '1px solid #ddd',
                backgroundColor: '#f0f0f0',
                width: '15%',
              }}
            >
              Action
            </TableCell>
            <TableCell
              style={{
                fontWeight: 'bold',
                border: '1px solid #ddd',
                backgroundColor: '#f0f0f0',
                width: '60%',
              }}
            >
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jsonData.map((item: DataItem, index: number) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell
                  style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                >
                  {index === 0 ||
                  item['Contributing Factor'] !==
                    jsonData[index - 1]['Contributing Factor']
                    ? item['Contributing Factor']
                    : ''}
                </TableCell>
                <TableCell
                  style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                >
                  {item.Action}
                </TableCell>
                <TableCell
                  style={{ border: '1px solid #ddd', verticalAlign: 'top' }}
                >
                  {item.Description}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LearningsTable;
