
'use client';
import React, { useContext } from "react";
import styles from "./navbar.module.css";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from '@tauri-apps/api/tauri';
import { MessageContext, PageNumberContext, CurrentPageNumber } from "../context/context";
import { BiMerge, BiCut  } from "react-icons/bi";

export default function Navbar() {
  const { message , setMessage } = useContext(MessageContext) as {message: string | undefined; setMessage:  React.Dispatch<React.SetStateAction<string | undefined>> };
  const { pageNumber, setPageNumber } = useContext(PageNumberContext) as unknown as { pageNumber: number | null | undefined; setPageNumber: React.Dispatch<React.SetStateAction<number | undefined>> };
  const { currentPage, setCurrentPage } = useContext(CurrentPageNumber) as unknown as { currentPage: number | null | undefined; setCurrentPage: React.Dispatch<React.SetStateAction<number | undefined>> };

  const openFileExplorer = async () => {
    console.log("Open File Explorer");
    const file = await open({
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
    setMessage(String(file)); 
  }

  const invokeMergeFunction = () => {
    console.log("Merge Function");
    invoke('merge_function', { pdf1FilePath: message, pdf2FilePath: 'file_path2', outputFilePath: 'output_file_path' }) // filler value for now
  }

  const invokeCutFunction = () => {
    console.log("Merge Function");
    invoke('cut_function', { pdfFilePath: message, pageToCut: 1}); // filler value for now 
  }
  
  return (
    <div className={styles.navbar}>
      <button onClick={openFileExplorer} className={styles.button}>Open File</button>
      <div className={styles.pageNum}>
        <p> Page Number:  </p>
        <p> {pageNumber} </p>
      </div>
      <div className={styles.btn}>
        <BiMerge onClick={invokeMergeFunction} className={styles.mergeBtn}/>
        <span> Merge </span>
      </div>
      <div className={styles.btn}>
        <BiCut onClick={invokeCutFunction} className={styles.mergeBtn}/>
        <span> Cut </span>
      </div>
    </div>
  );
}