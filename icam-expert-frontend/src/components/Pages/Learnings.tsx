import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import LearningsTable from '../formatters/jsonToTable/LearningsTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Learnings: React.FC = () => {
  const contextKey = 'learnings';
  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  console.log('STRINGIFIED RESULT: ', result);

  return (
    <IcamToolsBaseComponent
      description="Generates generic and high level key learnings that the organisation can benefit from. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=key-learnings"
      contextKey={contextKey}
    >
      {result && <LearningsTable text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Learnings;
