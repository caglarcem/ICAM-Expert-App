import { Typography } from '@mui/material';
import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Learnings: React.FC = () => {
  const contextKey = 'learnings';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Generates generic and high level key learnings that the organisation can benefit from. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=key-learnings"
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

export default Learnings;
