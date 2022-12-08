import PixelImage from "./PixelImage.js";

const reader = new FileReader();
let fileName = "";
let currentImgFile = null;

document.addEventListener("keydown", (e)=>{
  if(e.key === "Enter"){
    console.log("FlipY")
    currentImgFile.flipY()
    draw()
  }
})

const css_classes = {
  NO_FILE_SELECTED: 'no-file-selected'
}
const fileSaveBtn = document.getElementById("save-file-button");
const filePickerBtn = document.getElementById("file-picker");
const canvas = document.getElementById("canvas");

canvas.addEventListener("mousewheel", handleMouseWheel);

fileSaveBtn.addEventListener("click", (e) => {
  saveImage(currentImgFile).then();
});

reader.addEventListener("load", ({ target }) => {
  try {
    handleImageLoad(target.result);
    fileSaveBtn.removeAttribute("disabled");
    canvas.parentElement.classList.remove(css_classes.NO_FILE_SELECTED)
  } catch (e) {}
});

filePickerBtn.addEventListener("change", ({ target }) => {
  const file = target.files[0];
  fileName = file.name;
  updateFileNameUI(fileName);
  reader.readAsText(file);
});
function updateFileNameUI(name) {
  document.getElementById("file-name").innerText = `Editing: ${name}`;
}

function handleImageLoad(rawTextData) {
  currentImgFile = new PixelImage(rawTextData);
  draw();
}

function draw(){
  const { width, height } = currentImgFile.getDimensions();
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imageData = currentImgFile.getImageData();
  ctx.putImageData(imageData, 0, 0);
}

let current = 1;
function handleMouseWheel(e) {
  const i = e.deltaY < 0 ? 1 : -1;
  if (current === 1 && i === -1) return;
  current += i;
  canvas.style.transform = `scale(${current},${current})`;
}

async function saveImage(pixelImage) {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `${fileName}`,
    });
    const fileStream = await fileHandle.createWritable();
    await fileStream.write(
      new Blob([pixelImage.toString()], { type: "text/plain" })
    );
    await fileStream.close();
    alert(`${fileName} saved locally!`);
  } catch (e) {}
}

