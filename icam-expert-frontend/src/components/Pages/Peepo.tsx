import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import PeepoAnalysisTable from '../formatters/jsonToTable/PeepoTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Peepo: React.FC = () => {
  const contextKey = 'peepo';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  return (
    <IcamToolsBaseComponent
      description="Analyses the input and builds a PEEPO for the type of the incident in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=peepo-builder"
      contextKey={contextKey}
    >
      {result && <PeepoAnalysisTable text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Peepo;
