// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
  // this is an option, or custom toolbar...
  // let openfile = CustomMenuItem::new("openfile".to_string(), "Open File...");
  // let submenu = Submenu::new("File", Menu::new().add_item(openfile));
  // let menu = Menu::new()
  //   .add_submenu(submenu);

  tauri::Builder::default()
    //.menu(menu)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
