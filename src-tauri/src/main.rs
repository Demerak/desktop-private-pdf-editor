// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

#[tauri::command]
fn merge_function(pdf1_file_path: String, pdf2_file_path: String, output_file_path: String) {
  println!("Merge Function was invoked from JS!");
  println!("pdf1_file_path: {}", pdf1_file_path);
}

#[tauri::command]
fn cut_function(pdf_file_path: String, page_to_cut: u8) {
  println!("Cut Function was invoked from JS!");
  println!("pdf_file_path: {}", pdf_file_path);
}

fn main() {
  // this is an option, or custom toolbar...
  // let openfile = CustomMenuItem::new("openfile".to_string(), "Open File...");
  // let submenu = Submenu::new("File", Menu::new().add_item(openfile));
  // let menu = Menu::new()
  //   .add_submenu(submenu);

  tauri::Builder::default()
    //.menu(menu)
    .invoke_handler(tauri::generate_handler![merge_function, cut_function])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
