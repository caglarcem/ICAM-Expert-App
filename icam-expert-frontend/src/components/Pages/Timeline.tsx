import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import TimelineTable from '../formatters/jsonToTable/TimelineTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Timeline: React.FC = () => {
  const contextKey = 'timeline';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  return (
    <IcamToolsBaseComponent
      description="Generates the timeline of the incident. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=timeline-builder"
      contextKey={contextKey}
    >
      {result && <TimelineTable text={result}></TimelineTable>}
    </IcamToolsBaseComponent>
  );
};

export default Timeline;
