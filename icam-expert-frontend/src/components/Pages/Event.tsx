import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Event: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="Generates brief event description based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=brief-description-of-the-event"
    />
  );
};

export default Event;
