import PixelImage from "./PixelImage.js";

const reader = new FileReader();
let fileName = ""
let currentImgFile = null;

const fileSaveBtn = document.getElementById("save-file-button")
const filePickerBtn = document.getElementById("file-picker");

fileSaveBtn.addEventListener('click', (e) => {
  saveImage(currentImgFile).then()
})

reader.addEventListener("load", ({ target }) => {
  try {
    handleImageLoad(target.result)
    fileSaveBtn.removeAttribute("disabled")
  } catch (e) {

  }
});

filePickerBtn.addEventListener("change", ({ target }) => {
  const file = target.files[0];
  fileName = file.name;
  updateFileNameUI(fileName)
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

async function saveImage(pixelImage){
  try {
    const fileHandle = await window.showSaveFilePicker({suggestedName: `${fileName}`});
    const fileStream = await fileHandle.createWritable();
    await fileStream.write(new Blob([pixelImage.toString()], {type: "text/plain"}));
    await fileStream.close();
    alert(`${fileName} saved locally!`)
  } catch (e) {

  }
}
