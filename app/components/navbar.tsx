
'use client';
import React, { useContext } from "react";
import styles from "./navbar.module.css";
import { open } from "@tauri-apps/api/dialog";
import { MessageContext } from "../context/context";

export default function Navbar() {
  const { setMessage } = useContext(MessageContext) as {setMessage:  React.Dispatch<React.SetStateAction<string | undefined>> };

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
  
  return (
    <div className={styles.navbar}>
      <button onClick={openFileExplorer} className={styles.button}>Open File</button>
    </div>
  );
}