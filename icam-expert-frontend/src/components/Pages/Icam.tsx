import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import IcamTable from '../formatters/jsonToTable/IcamTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { PromptSettings } from './PromptSettings';

const Icam: React.FC<PromptSettings> = ({ settings }) => {
  const contextKey = 'icam';

  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  const apiEndpoint = `/queryDocuments/report?tool=icam-analysis&state=${settings.state}&minetype=${settings.mineType}&commodity=${settings.commodity}`;

  return (
    <IcamToolsBaseComponent
      description="List Absent / Failed Defences, Individual /Team Actions, Task / Environmental Conditions, and Organisational factors in a table format. Select Files and press submit."
      apiEndpoint={apiEndpoint}
      contextKey={contextKey}
    >
      {result && <IcamTable text={result} />}
    </IcamToolsBaseComponent>
  );
};

export default Icam;
