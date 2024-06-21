import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { useReportResult } from '../../context/ReportResultProvider';
import { Typography } from '@mui/material';

const Timeline: React.FC = () => {
  const contextKey = 'timeline';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Generates the timeline of the incident. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=timeline-builder"
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

export default Timeline;
