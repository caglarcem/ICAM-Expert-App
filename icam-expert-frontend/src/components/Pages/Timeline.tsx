import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import TimelineTable from '../formatters/jsonToTable/TimelineTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { PromptSettings } from './PromptSettings';

const Timeline: React.FC<PromptSettings> = ({ settings }) => {
  const contextKey = 'timeline';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  const apiEndpoint = `/queryDocuments/report?tool=timeline-builder&state=${settings.state}&minetype=${settings.mineType}&commodity=${settings.commodity}`;

  return (
    <IcamToolsBaseComponent
      description="Generates the timeline of the incident. Select Files and press submit."
      apiEndpoint={apiEndpoint}
      contextKey={contextKey}
    >
      {result && <TimelineTable text={result}></TimelineTable>}
    </IcamToolsBaseComponent>
  );
};

export default Timeline;
