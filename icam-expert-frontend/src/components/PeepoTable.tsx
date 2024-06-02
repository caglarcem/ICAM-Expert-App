import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const PeepoAnalysisTable = ({ peepoAnalysis }: { peepoAnalysis: string }) => {
  // Check if peepoAnalysis exists
  if (!peepoAnalysis) {
    return null; // Return null to render an empty container
  }

  // Parse the response text and extract the PEEPO analysis data
  const parsePeepoAnalysis = (peepoAnalysis: string) => {
    const rows = peepoAnalysis.split('###');
    return rows.map(row => {
      const columns = row.split('|').map(item => item.trim());
      return columns.filter(column => column !== '');
    });
  };

  const peepoData = parsePeepoAnalysis(peepoAnalysis);

  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Potential Items to Investigate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {peepoData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PeepoAnalysisTable;
