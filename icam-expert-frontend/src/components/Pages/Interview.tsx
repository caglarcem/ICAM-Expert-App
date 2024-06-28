import { Stack } from '@mui/material';
import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import InterviewSummary from '../formatters/InterviewSummary';
import InterviewTable from '../formatters/jsonToTable/InterviewTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Interview: React.FC = () => {
  const contextKey = 'interview';
  const { reportResults } = useReportResult();

  const parts = reportResults[contextKey]?.split('###');

  const summary = parts?.length > 0 ? parts[0] : '';
  const tableJson = parts?.length > 1 ? parts[1] : '';

  return (
    <IcamToolsBaseComponent
      description="Generates follow-up interview questions based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=generate-follow-up-interview-questions"
      contextKey={contextKey}
    >
      <Stack>
        <InterviewSummary text={summary} />
        <InterviewTable text={tableJson} />
      </Stack>
    </IcamToolsBaseComponent>
  );
};

export default Interview;
