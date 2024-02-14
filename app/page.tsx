'use client';
import React, { useState, useContext } from "react";
import styles from "./page.module.css";
import { MessageContext } from "./context/context";
import { invoke } from "@tauri-apps/api/tauri";


// async function invokeTauriCommand(command: any) {
//   return invoke("tauri", command);
// }

export default function Home() {
  const { message } = useContext(MessageContext) as { message: string };
  console.log("Home: " + message);

  return (
    <main className={styles.main}>
      <h1> PDF READER </h1>
    </main>
  );
}
