import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { useReportResult } from '../../context/ReportResultProvider';
import { Typography } from '@mui/material';

const Rca: React.FC = () => {
  const contextKey = 'rca';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Root cause analysis of the incident. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=root-cause-analysis"
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

export default Rca;
