'use client';
import React, { useState, useContext, useEffect } from "react";
import { MessageContext, PageNumberContext, CurrentPageNumber } from "./context/context";
import { readBinaryFile } from '@tauri-apps/api/fs';
import { Document, Page, pdfjs} from 'react-pdf';
import AutoSizer from "react-virtualized-auto-sizer";  

import styles from "./page.module.css";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function Home() {
  const { message } = useContext(MessageContext) as { message: string };
  console.log("Home: " + message);

  const [pdfPath, setPDFPath] = useState<File | undefined>();
  // const [pageNumber, setPageNumber] = useState<number | undefined>();
  const { pageNumber, setPageNumber } = useContext(PageNumberContext) as unknown as { pageNumber: number | null | undefined; setPageNumber: React.Dispatch<React.SetStateAction<number | undefined>> };
  // const { currentPage, setCurrentPage } = useContext(CurrentPageNumber) as unknown as { currentPage: number | null | undefined; setCurrentPage: React.Dispatch<React.SetStateAction<number | undefined>> };


  useEffect(() => {
    const loadPDF = async () => {
      const pdfData = await readBinaryFile(message);
      const file = new File([pdfData], "application/pdf");
      setPDFPath(file);
      console.log(message);
    };
    loadPDF();
  }, [message]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPageNumber(numPages);
  };

  return (
    <main className={styles.main}>
      <div className={styles.pdfView}> 
        <AutoSizer>
        {({ height, width }) => (
          <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(pageNumber), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} height={height} width={width} />
            ))}
          </Document>
        )}
      </AutoSizer>
      </div>
    </main>
  );
}
