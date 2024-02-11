
'use client';
import React from "react";
import styles from "./navbar.module.css";
import { open } from "@tauri-apps/api/dialog";

export default function navbar() {

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
    console.log(file);
  }
  
  return (
    <div className={styles.navbar}>
      <button onClick={openFileExplorer} className={styles.button} >Open File</button>
    </div>
  );
}