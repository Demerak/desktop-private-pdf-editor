'use client'
import React, { createContext, useState, ReactNode } from "react";

interface IFilePathContext {
  filePath: string | undefined;
  setFilePath: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface IPageNumberContext {
  pageNumber:  number | undefined;
  setPageNumber:  React.Dispatch<React.SetStateAction<number | undefined>>;
};

interface ICurrentPageNumberContext {
  currentPageNumber:  number | undefined;
  setCurrentPageNumber:  React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const FilePathContext = createContext<IFilePathContext | null>(null);
export const PageNumberContext = createContext<IPageNumberContext | undefined>(undefined);
export const CurrentPageNumber = createContext<ICurrentPageNumberContext | undefined>(undefined);

interface Props {
  children: ReactNode;
}

function Context({ children }: Props): JSX.Element {
  const [filePath, setFilePath] = useState<string | undefined>();
  const [pageNumber, setPageNumber] = useState<number | undefined>();
  const [currentPageNumber, setCurrentPageNumber] = useState<number | undefined>();

  return (
    <FilePathContext.Provider value={{ filePath: filePath, setFilePath: setFilePath }}>
      <PageNumberContext.Provider value={{pageNumber, setPageNumber}}> 
        <CurrentPageNumber.Provider value={{currentPageNumber, setCurrentPageNumber}}> 
          {children}
        </CurrentPageNumber.Provider>
      </PageNumberContext.Provider>
    </FilePathContext.Provider>
  );
}

export default Context;
