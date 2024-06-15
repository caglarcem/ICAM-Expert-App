import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ReportResultContextType {
  reportResults: { [key: string]: string };
  setReportResult: (key: string, result: string) => void;
}

const ReportResultContext = createContext<ReportResultContextType | undefined>(
  undefined
);

const ReportResultProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reportResults, setReportResults] = useState<{ [key: string]: string }>(
    {}
  );

  const setReportResult = (key: string, result: string) => {
    setReportResults(prevResults => ({ ...prevResults, [key]: result }));
  };

  return (
    <ReportResultContext.Provider value={{ reportResults, setReportResult }}>
      {children}
    </ReportResultContext.Provider>
  );
};

const useReportResult = () => {
  const context = useContext(ReportResultContext);
  if (!context) {
    throw new Error(
      'useReportResult must be used within a ReportResultProvider'
    );
  }
  return context;
};

export { ReportResultProvider, useReportResult };
