import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { Typography } from '@mui/material';
import { useReportResult } from '../../context/ReportResultProvider';
import ContributingTable from '../formatters/jsonToTable/ContributingTable';

const Contributing: React.FC = () => {
  const contextKey = 'contributing';
  const { reportResults } = useReportResult();

  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Analyzes the incident and identifies contributing factors based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=contributing-factors-analysis"
      contextKey={contextKey}
    >
      {result && <ContributingTable text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Contributing;
