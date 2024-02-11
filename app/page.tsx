'use client';
import React, { useState } from "react";
import styles from "./page.module.css";
import { invoke } from "@tauri-apps/api/tauri";


// async function invokeTauriCommand(command: any) {
//   return invoke("tauri", command);
// }

export default function Home() {


  return (
    <main className={styles.main}>
      <h1> PDF READER </h1>
    </main>
  );
}
