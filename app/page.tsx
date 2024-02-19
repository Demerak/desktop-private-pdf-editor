'use client';
import React, { useState, useContext, useEffect } from "react";
import { MessageContext } from "./context/context";
import { readBinaryFile } from '@tauri-apps/api/fs';
// import { invoke } from "@tauri-apps/api/tauri";
import { Document, Page, pdfjs} from 'react-pdf';

import styles from "./page.module.css";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// async function invokeTauriCommand(command: any) {
//   return invoke("tauri", command);
// }

export default function Home() {
  const { message } = useContext(MessageContext) as { message: string };
  console.log("Home: " + message);

  const [pdfPath, setPDFPath] = useState<File | undefined>();

  useEffect(() => {
    const loadPDF = async () => {
      const pdfData = await readBinaryFile(message);
      const file = new File([pdfData], "application/pdf");
      setPDFPath(file);
      console.log(message);
    };

    loadPDF();
  }, [message]);

  return (
    <main className={styles.main}>
      <h1> PDF READER </h1>
      <Document file={pdfPath}>
        <Page pageNumber={1}/>
      </Document>
      {/* <iframe src={pdfPath} title="PDF Viewer" /> */}
    </main>
  );
}
