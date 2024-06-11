import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Contributing: React.FC = () => {
  return (
    <div>
      <IcamToolsBaseComponent
        description="Analyzes the incident and identifies contributing factors based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
        apiEndpoint="/queryDocuments/report?tool=contributing-factors-analysis"
        contextKey="contributing"
      />
    </div>
  );
};

export default Contributing;
