import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import IcamTable from '../formatters/jsonToTable/IcamTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Icam: React.FC = () => {
  const contextKey = 'icam';

  const { reportResults } = useReportResult();
  const result = reportResults[contextKey];

  return (
    <IcamToolsBaseComponent
      description="List Absent / Failed Defences, Individual /Team Actions, Task / Environmental Conditions, and Organisational factors in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=icam-analysis"
      contextKey={contextKey}
    >
      {result && <IcamTable text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Icam;
