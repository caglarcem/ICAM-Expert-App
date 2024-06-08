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

interface TableData {
  header1: string;
  header2: string;
  data: string[][];
}

interface MUITableProps {
  header1: string;
  header2: string;
  data: string[][];
}

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

const MUITable: React.FC<MUITableProps> = ({ header1, header2, data }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{header1}</TableCell>
          <TableCell>{header2}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row[0]}</TableCell>
            <TableCell>{row[1]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

interface AppProps {
  peepoAnalysis: string;
}

const PeepoTable: React.FC<AppProps> = ({ peepoAnalysis }) => {
  const tables = parseTextToTables(peepoAnalysis);
  return (
    <Container>
      {tables.map((table, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {table.header1}
          </Typography>
          <MUITable {...table} />
        </div>
      ))}
    </Container>
  );
};

export default PeepoTable;
