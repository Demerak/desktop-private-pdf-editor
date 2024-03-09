// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use lopdf::dictionary;

use std::collections::BTreeMap;
use std::fs::File;
use std::io::BufWriter;
use std::path::PathBuf;

use lopdf::{Bookmark, Document, Object, ObjectId};

// this function is used to merge two pdfs together
// it was taken from the lopdf crate examples
fn merge(
    pdf1_file_path: String,
    pdf2_file_path: String,
    output_file_path: String,
) -> std::io::Result<Option<String>> {
    let documents = vec![
        Document::load(pdf1_file_path).unwrap(),
        Document::load(pdf2_file_path).unwrap(),
    ];

    // Define a starting max_id (will be used as start index for object_ids)
    let mut max_id = 1;
    let mut pagenum = 1;
    // Collect all Documents Objects grouped by a map
    let mut documents_pages: BTreeMap<(u32, u16), Object> = BTreeMap::new();
    let mut documents_objects = BTreeMap::new();
    let mut document = Document::with_version("1.5");

    for mut doc in documents {
        let mut first = false;
        doc.renumber_objects_with(max_id);

        max_id = doc.max_id + 1;

        documents_pages.extend(
            doc.get_pages()
                .into_iter()
                .map(|(_, object_id)| {
                    if !first {
                        let bookmark = Bookmark::new(
                            String::from(format!("Page_{}", pagenum)),
                            [0.0, 0.0, 1.0],
                            0,
                            object_id,
                        );
                        document.add_bookmark(bookmark, None);
                        first = true;
                        pagenum += 1;
                    }

                    (object_id, doc.get_object(object_id).unwrap().to_owned())
                })
                .collect::<BTreeMap<ObjectId, Object>>(),
        );
        documents_objects.extend(doc.objects);
    }

    // Catalog and Pages are mandatory
    let mut catalog_object: Option<(ObjectId, Object)> = None;
    let mut pages_object: Option<(ObjectId, Object)> = None;

    // Process all objects except "Page" type
    for (object_id, object) in documents_objects.iter() {
        // We have to ignore "Page" (as are processed later), "Outlines" and "Outline" objects
        // All other objects should be collected and inserted into the main Document
        match object.type_name().unwrap_or("") {
            "Catalog" => {
                // Collect a first "Catalog" object and use it for the future "Pages"
                catalog_object = Some((
                    if let Some((id, _)) = catalog_object {
                        id
                    } else {
                        *object_id
                    },
                    object.clone(),
                ));
            }
            "Pages" => {
                // Collect and update a first "Pages" object and use it for the future "Catalog"
                // We have also to merge all dictionaries of the old and the new "Pages" object
                if let Ok(dictionary) = object.as_dict() {
                    let mut dictionary = dictionary.clone();
                    if let Some((_, ref object)) = pages_object {
                        if let Ok(old_dictionary) = object.as_dict() {
                            dictionary.extend(old_dictionary);
                        }
                    }

                    pages_object = Some((
                        if let Some((id, _)) = pages_object {
                            id
                        } else {
                            *object_id
                        },
                        Object::Dictionary(dictionary),
                    ));
                }
            }
            "Page" => {}     // Ignored, processed later and separately
            "Outlines" => {} // Ignored, not supported yet
            "Outline" => {}  // Ignored, not supported yet
            _ => {
                document.objects.insert(*object_id, object.clone());
            }
        }
    }

    // If no "Pages" object found abort
    if pages_object.is_none() {
        println!("Pages root not found.");

        return Ok(None);
    }

    // Iterate over all "Page" objects and collect into the parent "Pages" created before
    for (object_id, object) in documents_pages.iter() {
        if let Ok(dictionary) = object.as_dict() {
            let mut dictionary = dictionary.clone();
            dictionary.set("Parent", pages_object.as_ref().unwrap().0);

            document
                .objects
                .insert(*object_id, Object::Dictionary(dictionary));
        }
    }

    // If no "Catalog" found abort
    if catalog_object.is_none() {
        println!("Catalog root not found.");

        return Ok(None);
    }

    let catalog_object = catalog_object.unwrap();
    let pages_object = pages_object.unwrap();

    // Build a new "Pages" with updated fields
    if let Ok(dictionary) = pages_object.1.as_dict() {
        let mut dictionary = dictionary.clone();

        // Set new pages count
        dictionary.set("Count", documents_pages.len() as u32);

        // Set new "Kids" list (collected from documents pages) for "Pages"
        dictionary.set(
            "Kids",
            documents_pages
                .into_iter()
                .map(|(object_id, _)| Object::Reference(object_id))
                .collect::<Vec<_>>(),
        );

        document
            .objects
            .insert(pages_object.0, Object::Dictionary(dictionary));
    }

    // Build a new "Catalog" with updated fields
    if let Ok(dictionary) = catalog_object.1.as_dict() {
        let mut dictionary = dictionary.clone();
        dictionary.set("Pages", pages_object.0);
        dictionary.remove(b"Outlines"); // Outlines not supported in merged PDFs

        document
            .objects
            .insert(catalog_object.0, Object::Dictionary(dictionary));
    }

    document.trailer.set("Root", catalog_object.0);

    // Update the max internal ID as wasn't updated before due to direct objects insertion
    document.max_id = document.objects.len() as u32;

    // Reorder all new Document objects
    document.renumber_objects();

    //Set any Bookmarks to the First child if they are not set to a page
    document.adjust_zero_pages();

    //Set all bookmarks to the PDF Object tree then set the Outlines to the Bookmark content map.
    if let Some(n) = document.build_outline() {
        if let Ok(x) = document.get_object_mut(catalog_object.0) {
            if let Object::Dictionary(ref mut dict) = x {
                dict.set("Outlines", Object::Reference(n));
            }
        }
    }

    document.compress();

    let path = PathBuf::from(output_file_path);
    let path_str = path.to_string_lossy();
    println!("{}", path_str);
    let mut file = BufWriter::new(File::create(&path)?);
    document.save_to(&mut file)?;

    Ok(Some(path_str.to_string()))
}

fn cut(
    pdf_file_path: String,
    page_to_cut: Vec<u32>,
    output_file_path: String,
) -> std::io::Result<Option<String>> {
    let mut document = Document::load(pdf_file_path).unwrap();

    for &page in &page_to_cut {
        document.delete_pages(&[page]);
    }

    let path = PathBuf::from(output_file_path);
    let path_str = path.to_string_lossy();

    println!("{}", path_str);

    let mut file = BufWriter::new(File::create(&path)?);
    document.save_to(&mut file);

    Ok(None)
}

#[tauri::command]
fn merge_function(
    pdf1_file_path: String,
    pdf2_file_path: String,
    output_file_path: String,
) -> Result<String, String> {
    println!("Merge Function was invoked from JS!");
    println!("pdf1_file_path: {}", pdf1_file_path);
    println!("pdf2_file_path: {}", pdf2_file_path);
    let result = merge(pdf1_file_path, pdf2_file_path, output_file_path);
    match result {
        Ok(Some(result)) => {
            println!("String value: {}", result);
            Ok("This worked!".into())
        }
        Ok(None) => {
            println!("No string value found");
            Err("No string value found".into())
        }
        Err(error) => {
            eprintln!("Error: {}", error);
            Err("Error".into())
        }
    }
}

#[tauri::command]
fn cut_function(pdf_file_path: String, page_to_cut: Vec<u32>, output_file_path: String) {
    println!("Cut Function was invoked from JS!");
    println!("pdf_file_path: {}", pdf_file_path);
    match cut(pdf_file_path, page_to_cut, output_file_path) {
        Ok(Some(_)) => {
            println!("This worked!");
        }
        Ok(None) => {
            println!("No string value found");
        }
        Err(error) => {
            println!("Error: {}", error);
        }
    }
}

fn main() {
    tauri::Builder::default()
        //.menu(menu)
        .invoke_handler(tauri::generate_handler![merge_function, cut_function])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
