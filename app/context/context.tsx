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

interface ICutModeContext {
  cutMode: boolean;
  setCutMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICutSelectedPagesContext {
  selectedPages: number[];
  setSelectedPages: React.Dispatch<React.SetStateAction<number[]>>;
}

export const FilePathContext = createContext<IFilePathContext | null>(null);
export const PageNumberContext = createContext<IPageNumberContext | undefined>(undefined);
export const CurrentPageNumber = createContext<ICurrentPageNumberContext | undefined>(undefined);
export const CutModeContext = createContext<ICutModeContext | undefined>(undefined);
export const CutSelectedPagesContext = createContext<ICutSelectedPagesContext | undefined>(undefined);


interface Props {
  children: ReactNode;
}

function Context({ children }: Props): JSX.Element {
  const [filePath, setFilePath] = useState<string | undefined>();
  const [pageNumber, setPageNumber] = useState<number | undefined>();
  const [currentPageNumber, setCurrentPageNumber] = useState<number | undefined>();
  const [cutMode, setCutMode] = useState<boolean>(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  return (
    <FilePathContext.Provider value={{ filePath: filePath, setFilePath: setFilePath }}>
      <PageNumberContext.Provider value={{pageNumber, setPageNumber}}> 
        <CurrentPageNumber.Provider value={{currentPageNumber, setCurrentPageNumber}}> 
          <CutModeContext.Provider value={{cutMode, setCutMode}}>
            <CutSelectedPagesContext.Provider value={{selectedPages, setSelectedPages}}>
              {children}
            </CutSelectedPagesContext.Provider>
          </CutModeContext.Provider>
        </CurrentPageNumber.Provider>
      </PageNumberContext.Provider>
    </FilePathContext.Provider>
  );
}

export default Context;
