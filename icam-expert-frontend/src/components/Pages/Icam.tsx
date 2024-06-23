import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';
import { useReportResult } from '../../context/ReportResultProvider';
import { Typography } from '@mui/material';
import IcamTable from '../formatters/jsonToTable/IcamTable';

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
