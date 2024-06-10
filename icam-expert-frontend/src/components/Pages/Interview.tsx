import React from 'react';
import IcamToolsBaseComponent from './Base/IcamToolsBaseComponent';

const Interview: React.FC = () => {
  return (
    <IcamToolsBaseComponent
      description="Generates follow-up interview questions based on the event debrief, witness statements, and other provided documents. Select Files and press submit."
      apiEndpoint="/queryDocuments/report?tool=generate-follow-up-interview-questions"
    />
  );
};

export default Interview;
