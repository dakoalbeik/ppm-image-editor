import PixelImage from "./PixelImage.js";

const reader = new FileReader();
let currentImgFile = null;
reader.addEventListener("load", ({ target }) => {
  const data = target.result.split(/\s+/)
  currentImgFile = new PixelImage(data)

});
const filePickerBtn = document.getElementById("file-picker");

filePickerBtn.addEventListener("change", ({ target }) => {
  const file = target.files[0];
  updateFileNameUI(file.name)
  reader.readAsText(file);

});
function updateFileNameUI(name){
  document.getElementById("file-name").innerText = `Editing: ${name}`;
}
// const fileSaveBtn = document.getElementById("save-file-button");
