
'use client';
import React, { useContext } from "react";
import styles from "./navbar.module.css";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from '@tauri-apps/api/tauri';
import { MessageContext, PageNumberContext, CurrentPageNumber } from "../context/context";
import { BiMerge, BiCut, BiSolidFolderOpen  } from "react-icons/bi";

export default function Navbar() {
  const { message , setMessage } = useContext(MessageContext) as {message: string | undefined; setMessage:  React.Dispatch<React.SetStateAction<string | undefined>> };
  const { pageNumber, setPageNumber } = useContext(PageNumberContext) as unknown as { pageNumber: number | null | undefined; setPageNumber: React.Dispatch<React.SetStateAction<number | undefined>> };
  const { currentPage, setCurrentPage } = useContext(CurrentPageNumber) as unknown as { currentPage: number | null | undefined; setCurrentPage: React.Dispatch<React.SetStateAction<number | undefined>> };

  const openFileExplorer = async () => {
    console.log("Open File Explorer");
    const pdfFile = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          // only display pdf files
          name: "PDF",
          extensions: ["pdf"],
        },
      ],
    })
    return pdfFile;
  }

  const setSelectedPDF = async () => {
    const pdfFile = await openFileExplorer();
    setMessage(String(pdfFile)); 
  }

  const invokeMergeFunction = async () => {
    console.log("Merge Function");
    const newPDFToMerge = await openFileExplorer();
    invoke('merge_function', { pdf1FilePath: message, pdf2FilePath: String(newPDFToMerge), outputFilePath: 'merged.pdf' }) // filler value for now
  }

  const invokeCutFunction = () => {
    console.log("Merge Function");
    invoke('cut_function', { pdfFilePath: message, pageToCut: 1}); // filler value for now 
  }
  
  return (
    <div className={styles.navbar}>
      <button onClick={setSelectedPDF} className={styles.navBtn} data-hover="Open File Explorer">
        <BiSolidFolderOpen className={styles.buttonIcon} />
      </button>
      <div className={styles.pageNum}>
        <p> Page Number:  </p>
        <p> {pageNumber} </p>
      </div>
    
      <button onClick={invokeMergeFunction} className={styles.navBtn} data-hover="Merge">
        <BiMerge className={styles.buttonIcon}/>
      </button>
  
      <button onClick={invokeCutFunction} className={styles.navBtn} data-hover="Cut">
        <BiCut className={styles.buttonIcon}/>
      </button>
    </div>
  );
}