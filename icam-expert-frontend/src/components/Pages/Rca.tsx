import { Stack } from '@mui/system';
import React from 'react';
import { useReportResult } from '../../context/ReportResultProvider';
import RcaSummary from '../formatters/RcaSummary';
import RcaTable from '../formatters/jsonToTable/RcaTable';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Rca: React.FC = () => {
  const contextKey = 'rca';

  const { reportResults } = useReportResult();

  let result = reportResults[contextKey];
  if (typeof result === 'object') {
    result = JSON.stringify(reportResults[contextKey]);
  }

  const parts = result?.split('###');

  const summary1 = parts?.length > 0 ? parts[0] : '';
  const tableJson1 = parts?.length > 1 ? parts[1] : '';
  const summary2 = parts?.length > 2 ? parts[2] : '';
  const tableJson2 = parts?.length > 3 ? parts[3] : '';

  return (
    <IcamToolsBaseComponent
      description="List Absent / Failed Defences, Individual /Team Actions, Task / Environmental Conditions, and Organisational factors in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=root-cause-analysis"
      contextKey={contextKey}
    >
      <Stack>
        <RcaSummary text={summary1} />
        <RcaTable text={tableJson1} />
        <RcaSummary text={summary2} />
        <RcaTable text={tableJson2} />
      </Stack>
    </IcamToolsBaseComponent>
  );
};

export default Rca;
