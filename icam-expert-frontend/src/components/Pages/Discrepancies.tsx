import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import DiscrepancySummary from '../formatters/DiscrepancySummary';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { PromptSettings } from './PromptSettings';

const Discrepancies: React.FC<PromptSettings> = ({ settings }) => {
  const contextKey = 'discrepancies';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];

  const apiEndpoint = `/queryDocuments/report?tool=discrepancy-analysis&state=${settings.state}&minetype=${settings.mineType}&commodity=${settings.commodity}`;

  return (
    <IcamToolsBaseComponent
      description="Analyses the discrepancies between information from multiple sources, based on the event debrief, witness statements, and any other documents provided. Select Files and press submit."
      apiEndpoint={apiEndpoint}
      contextKey={contextKey}
    >
      {result && <DiscrepancySummary text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Discrepancies;
