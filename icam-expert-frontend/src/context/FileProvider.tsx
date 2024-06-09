import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <FileContext.Provider value={{ files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};
