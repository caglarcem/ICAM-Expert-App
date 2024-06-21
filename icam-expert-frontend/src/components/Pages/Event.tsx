import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { useReportResult } from '../../context/ReportResultProvider';
import { Typography } from '@mui/material';

const Event: React.FC = () => {
  const contextKey = 'event';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Generates brief event description based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=brief-description-of-the-event"
      contextKey="event"
    >
      {result && (
        <Typography sx={{ marginTop: '32px' }} data-testid="report-result">
          {result}
        </Typography>
      )}
    </IcamToolsBaseComponent>
  );
};

export default Event;
