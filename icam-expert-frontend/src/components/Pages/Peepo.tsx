import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { useReportResult } from '../../context/ReportResultProvider';
import PeepoAnalysisTable from '../formatters/jsonToTable/PeepoTable';

const Peepo: React.FC = () => {
  const contextKey = 'peepo';
  const { reportResults } = useReportResult();
  const peepoAnalysis = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Analyses the input and builds a PEEPO for the type of the incident in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=peepo-builder"
      contextKey={contextKey}
    >
      {peepoAnalysis && <PeepoAnalysisTable peepoAnalysis={peepoAnalysis} />}
    </IcamToolsBaseComponent>
  );
};

export default Peepo;
