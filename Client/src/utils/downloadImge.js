import FileSaver from "file-saver";

export async function downloadImage(title, image) {
  FileSaver.saveAs(image, `download-${title}.jpg`);
}
