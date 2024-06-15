import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Timeline: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="Generates the timeline of the incident. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=timeline-builder"
      contextKey="timeline"
    />
  );
};

export default Timeline;
