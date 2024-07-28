import { Stack } from '@mui/material';
import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import InterviewTable from '../formatters/jsonToTable/InterviewTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { PromptSettings } from './PromptSettings';

const Interview: React.FC<PromptSettings> = ({ settings }) => {
  const contextKey = 'interview';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  const apiEndpoint = `/queryDocuments/report?tool=generate-follow-up-interview-questions&state=${settings.state}&minetype=${settings.mineType}&commodity=${settings.commodity}`;

  return (
    <IcamToolsBaseComponent
      description="Generates follow-up interview questions based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint={apiEndpoint}
      contextKey={contextKey}
    >
      <Stack>
        <InterviewTable text={result} />
      </Stack>
    </IcamToolsBaseComponent>
  );
};

export default Interview;
