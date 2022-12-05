import PixelImage from "./PixelImage.js";

const reader = new FileReader();
let currentImgFile = null;

reader.addEventListener("load", ({ target }) => {
  handleImageLoad(target.result)
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

function handleImageLoad(rawTextData){
  currentImgFile = new PixelImage(rawTextData)
  const { width, height } = currentImgFile.getDimensions();
  const canvas = document.getElementById("canvas")
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imageData = currentImgFile.getImageData()
  ctx.putImageData(imageData, 0, 0);

}
// const fileSaveBtn = document.getElementById("save-file-button");
