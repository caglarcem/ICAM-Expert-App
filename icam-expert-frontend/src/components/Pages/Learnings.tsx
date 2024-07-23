import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import LearningsTable from '../formatters/jsonToTable/LearningsTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { PromptSettings } from './PromptSettings';

const Learnings: React.FC<PromptSettings> = ({ settings }) => {
  const contextKey = 'learnings';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  const apiEndpoint = `/queryDocuments/report?tool=key-learnings&state=${settings.state}&minetype=${settings.mineType}&commodity=${settings.commodity}`;

  return (
    <IcamToolsBaseComponent
      description="Generates generic and high level key learnings that the organisation can benefit from. Select Files and press submit."
      apiEndpoint={apiEndpoint}
      contextKey={contextKey}
    >
      {result && <LearningsTable text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Learnings;
