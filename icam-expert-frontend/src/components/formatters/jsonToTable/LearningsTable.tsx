import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';

interface DataItem {
  'Contributing Factor': string;
  Action: string;
  Description: string;
}

interface Props {
  text: string;
}

const LearningsTable: React.FC<Props> = ({ text }) => {
  const jsonStart = text.indexOf('[');
  const jsonEnd = text.lastIndexOf(']');

  const jsonString = text.substring(jsonStart, jsonEnd + 1);

  console.log('JSON STRING:', jsonString);
  const jsonData = JSON.parse(jsonString);

  return (
    <TableContainer
      component={Paper}
      style={{ maxWidth: '800px', margin: 'auto' }}
    >
      <Table aria-label="learnings table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>
              Contributing Factor
            </TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jsonData.map((item: DataItem, index: number) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor:
                      index > 0 &&
                      item['Contributing Factor'] ===
                        jsonData[index - 1]['Contributing Factor']
                        ? '#ffffff'
                        : '#f0f0f0',
                  }}
                >
                  {index === 0 ||
                  item['Contributing Factor'] !==
                    jsonData[index - 1]['Contributing Factor']
                    ? item['Contributing Factor']
                    : ''}
                </TableCell>
                <TableCell>{item['Action']}</TableCell>
                <TableCell>{item['Description']}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LearningsTable;
