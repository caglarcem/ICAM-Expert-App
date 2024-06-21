import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

// Define the interface for table data
interface TableData {
  header1: string;
  header2: string;
  data: string[][];
}

// Define the interface for the MUITable props
interface MUITableProps {
  header1: string;
  header2: string;
  data: string[][];
}

// Function to parse text into table data
const parseTextToTables = (text: string): TableData[] => {
  const tables = text
    .split('###')
    .filter(Boolean)
    .map(tableText => {
      const [header, ...rows] = tableText.trim().split('***').filter(Boolean);
      const [header1, header2] = header.split('---').map(cell => cell.trim());
      const data = rows.map(row => row.split('---').map(cell => cell.trim()));
      return { header1, header2, data };
    });
  return tables;
};

// Function to render text with bold if surrounded by **
const renderText = (text: string) => {
  if (!text) return text; // Add defensive check to ensure text is not undefined
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <b key={index}>{part.slice(2, -2)}</b>
    ) : (
      part
    )
  );
};

// Functional component for Material-UI table
const MUITable: React.FC<MUITableProps> = ({ header1, header2, data }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{renderText(header1)}</TableCell>
          <TableCell>{renderText(header2)}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{renderText(row[0])}</TableCell>
            <TableCell>{renderText(row[1])}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// Define the interface for the AppProps
interface AppProps {
  peepoAnalysis: string;
}

// Functional component to render PEEPO analysis tables
const PeepoTable: React.FC<AppProps> = ({ peepoAnalysis }) => {
  if (!peepoAnalysis) return <></>;

  const tables = parseTextToTables(peepoAnalysis);
  return (
    <Container>
      {tables.map((table, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {renderText(table.header1)}
          </Typography>
          <MUITable {...table} />
        </div>
      ))}
    </Container>
  );
};

export default PeepoTable;
