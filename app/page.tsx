'use client';
import Image from "next/image";
import React, { useState } from "react";
import styles from "./page.module.css";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

// async function invokeTauriCommand(command: any) {
//   return invoke("tauri", command);
// }

export default function Home() {
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
    <main className={styles.main}>
      <button onClick={openFileExplorer}>File Explorer</button>
    </main>
  );
}
