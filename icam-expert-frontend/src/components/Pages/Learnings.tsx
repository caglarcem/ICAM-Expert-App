import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Learnings: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="Generates generic and high level key learnings that the organisation can benefit from. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=key-learnings"
      contextKey="learnings"
    />
  );
};

export default Learnings;
