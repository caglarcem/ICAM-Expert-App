import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Rca: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="Root cause analysis of the incident. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=root-cause-analysis"
      contextKey="rca"
    />
  );
};

export default Rca;
