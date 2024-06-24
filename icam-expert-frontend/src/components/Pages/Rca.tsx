import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import RcaTable from '../formatters/jsonToTable/RcaTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Rca: React.FC = () => {
  const contextKey = 'rca';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="Root cause analysis of the incident. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=root-cause-analysis"
      contextKey={contextKey}
    >
      {result && <RcaTable text={result}></RcaTable>}
    </IcamToolsBaseComponent>
  );
};

export default Rca;
