import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Peepo: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="Analyses the input and builds a PEEPO for the type of the incident in a table format. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=peepo-builder"
      contextKey="peepo"
    />
  );
};

export default Peepo;
