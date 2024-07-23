import { Typography } from '@mui/material';
import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { PromptSettings } from './PromptSettings';

const Event: React.FC<PromptSettings> = ({ settings }) => {
  const contextKey = 'event';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  const apiEndpoint = `/queryDocuments/report?tool=brief-description-of-the-event&state=${settings.state}&minetype=${settings.mineType}&commodity=${settings.commodity}`;

  return (
    <IcamToolsBaseComponent
      description="Generates brief event description based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint={apiEndpoint}
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
