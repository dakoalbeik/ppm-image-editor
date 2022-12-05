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
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  // TODO: figure out why that's not working
  // const imageData = currentImgFile.getImageData()
  // ctx.putImageData(imageData, 0, 0)
  const rows = currentImgFile.getPixelRows();
  for(let row = 0; row < height; row++){
    const pixelArray = rows[row];
    for(let col = 0; col < width; col++){
      const pixel = pixelArray.row[col]
      ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`
      ctx.fillRect(row, col, 1, 1)
    }
  }
}
// const fileSaveBtn = document.getElementById("save-file-button");
