'use client';
import Image from "next/image";
import React, { useState } from "react";
import styles from "./page.module.css";
import { invoke } from "@tauri-apps/api/tauri";

async function invokeTauriCommand(command: any) {
  return invoke("tauri", command);
}

export default function Home() {

  const openFileExplorer = async () => {
    console.log("Open File Explorer");
    open();
  }

  interface DialogFilter {
    /** Filter name. */
    name: string
    /**
     * Extensions to filter, without a `.` prefix.
     * @example
     * ```typescript
     * extensions: ['svg', 'png']
     * ```
     */
    extensions: string[]
  }

  interface OpenDialogOptions {
    /** The title of the dialog window. */
    title?: string
    /** The filters of the dialog. */
    filters?: DialogFilter[]
    /** Initial directory or file path. */
    defaultPath?: string
    /** Whether the dialog allows multiple selection or not. */
    multiple?: boolean
    /** Whether the dialog is a directory selection or not. */
    directory?: boolean
    /**
     * If `directory` is true, indicates that it will be read recursively later.
     * Defines whether subdirectories will be allowed on the scope or not.
     */
    recursive?: boolean
  }

  async function open(options: OpenDialogOptions = {}): Promise<null | string | string[]> {
    if (typeof options === 'object') {
      Object.freeze(options)
    }
    let res = invokeTauriCommand({
      __tauriModule: 'Dialog',
      message: {
        cmd: 'openDialog',
        options
      }
    })
    return res as any;
  }

  return (
    <main className={styles.main}>
      <button onClick={openFileExplorer}>File Explorer</button>
    </main>
  );
}
