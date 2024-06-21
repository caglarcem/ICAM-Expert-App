import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { useReportResult } from '../../context/ReportResultProvider';
import { Typography } from '@mui/material';

const Icam: React.FC = () => {
  const contextKey = 'icam';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="List Absent / Failed Defences, Individual /Team Actions, Task / Environmental Conditions, and Organisational factors in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=icam-analysis"
      contextKey={contextKey}
    >
      {result && (
        <Typography sx={{ marginTop: '32px' }} data-testid="report-result">
          {result}
        </Typography>
      )}
    </IcamToolsBaseComponent>
  );
};

export default Icam;
