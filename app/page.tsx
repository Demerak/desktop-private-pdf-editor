'use client';
import React, { useState, useContext, useEffect } from "react";
import { FilePathContext, PageNumberContext, CurrentPageNumber } from "./context/context";
import { readBinaryFile } from '@tauri-apps/api/fs';
import { Document, Page, pdfjs} from 'react-pdf';
import AutoSizer from "react-virtualized-auto-sizer"; 
import { BiMerge, BiCut, BiSolidFolderOpen } from "react-icons/bi"; 

import styles from "./page.module.css";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function Home() {
  const { filePath } = useContext(FilePathContext) as { filePath: string };

  const [pdfPath, setPDFPath] = useState<File | undefined>();
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  // const [pageNumber, setPageNumber] = useState<number | undefined>();
  const { pageNumber, setPageNumber } = useContext(PageNumberContext) as unknown as { pageNumber: number | null | undefined; setPageNumber: React.Dispatch<React.SetStateAction<number | undefined>> };
  // const { currentPage, setCurrentPage } = useContext(CurrentPageNumber) as unknown as { currentPage: number | null | undefined; setCurrentPage: React.Dispatch<React.SetStateAction<number | undefined>> };

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdfData = await readBinaryFile(filePath);
        const file = new File([pdfData], "application/pdf");
        setPDFPath(file);
        console.log(filePath);
      } catch (error) {
        console.error('Error loading PDF: ' + error);
      }
    };
    loadPDF();
  }, [filePath]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPageNumber(numPages);
  };

  const noData = () => {
    return (
      <div className={styles.noData}>
        <h3> Please select a file by clicking the <BiSolidFolderOpen/> button </h3>
        <div className={styles.instructions}>
          <p> 
            If you would like to merge a PDF, start by opening a PDF. Then, click the merge button <BiMerge /> and select the second PDF to merge.
          </p>
          <p>
            If you would like to cut a PDF, start by opening a PDF. Then, ``` todo  ```
          </p>
        </div>
      </div>
    );
  }

  const loading = () => {
    return (
      <div className={styles.noData}>
        <h3> Loading... </h3>
      </div>
    );
  }

  const pageClick = (pageNumber: number) => () => {
    setSelectedPages((prevSelectedPages) => {
      if (prevSelectedPages.includes(pageNumber)) {
        return prevSelectedPages.filter((page) => page !== pageNumber);
      } else {
        return [...prevSelectedPages, pageNumber];
      }
    });
  }

  return (
    <main className={styles.main}>
      <div className={styles.pdfView}> 
        <AutoSizer>
        {({ height, width }) => (
          <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess} loading={loading} noData={noData}>
            {Array.from(new Array(pageNumber), (_, index) => (
              <Page key={`page_${index + 1}`} onClick={pageClick(index+1)} className={selectedPages.includes(index + 1) ? styles.selectedPage : ''}pageNumber={index + 1} height={height} width={width} />
            ))}
          </Document>
        )}
      </AutoSizer>
      </div>
    </main>
  );
}
