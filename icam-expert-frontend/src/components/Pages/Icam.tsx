import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Icam: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="List Absent / Failed Defences, Individual /Team Actions, Task / Environmental Conditions, and Organisational factors in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=icam-analysis"
      contextKey="icam"
    />
  );
};

export default Icam;
