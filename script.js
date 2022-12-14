const reader = new FileReader();
let fileName = "";
let currentImgFile = null;
let currZoom = 1;

const ui = {
  fileSaveBtn: document.getElementById("save-file-button"),
  filePickerBtn: document.getElementById("file-picker"),
  canvas: document.getElementById("canvas"),
};

ui.fileSaveBtn.addEventListener("click", (e) => {
  saveImage(currentImgFile).then();
});

reader.addEventListener("load", handleImageLoad);

ui.filePickerBtn.addEventListener("change", ({ target }) => {
  try {
    const file = target.files[0];
    fileName = file.name;
    updateFileNameUI(fileName);
    reader.readAsText(file);
  } catch (e) {
    //  do nothing if user cancels
  }
});

function updateFileNameUI(name) {
  document.getElementById("file-name").innerText = `Editing: ${name}`;
}

function handleImageLoad(event) {
  try {
    const textData = event.target.result;
    currentImgFile = new PixelImage(textData);
    updateUI(currentImgFile);
    draw();
  } catch (e) {
    alert(e);
  }
}

function updateUI(image) {
  ui.fileSaveBtn.removeAttribute("disabled");
  ui.canvas.parentElement.classList.remove("no-file-selected");

  const tools = document.getElementById("tools");
  tools.innerHTML = "";

  const buttons = [
    { text: "-90", onclick: image.rotateCounterClockwise90 },
    { text: "+180", onclick: image.rotate180 },
    { text: "+90", onclick: image.rotateClockwise90 },
    { text: "Flip Vertically", onclick: image.flipX },
    { text: "Flip Horizontally", onclick: image.flipY },
    { text: "-", onclick: () => changeZoomLevel(-1) },
    { text: "+", onclick: () => changeZoomLevel(1) },
  ];
  buttons.forEach((button) => {
    const buttonElem = document.createElement("button");
    buttonElem.innerText = button.text;
    buttonElem.addEventListener("click", () => {
      button.onclick();
      draw();
    });
    tools.appendChild(buttonElem);
  });
}

function draw() {
  const { width, height } = currentImgFile.getDimensions();
  ui.canvas.width = width;
  ui.canvas.height = height;
  const isLandscape = width >= height;
  if (isLandscape) {
    ui.canvas.style.width = "50%";
    ui.canvas.style.height = "";
  } else {
    ui.canvas.style.height = "80%";
    ui.canvas.style.width = "";
  }
  document.getElementById("dimensions").innerText = `${width}px ??? ${height}px`;
  const ctx = ui.canvas.getContext("2d");
  const imageData = currentImgFile.getImageData();
  ctx.putImageData(imageData, 0, 0);
}

function changeZoomLevel(sign) {
  if (currZoom === 1 && sign === -1) return;
  currZoom += sign * 3;
  ui.canvas.style.transform = `scale(${currZoom},${currZoom})`;
}

async function saveImage(pixelImage) {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
    });
    const fileStream = await fileHandle.createWritable();
    await fileStream.write(
      new Blob([pixelImage.toString()], { type: "text/plain" })
    );
    await fileStream.close();
    alert(`${fileName} saved locally!`);
  } catch (e) {
    if (e?.name === "AbortError") return;
    // if window.showSaveFilePicker is not supported then download it through an anchor tag
    try {
      const link = document.createElement("a");
      const file = new Blob([pixelImage.toString()], { type: "text/plain" });
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      alert(
        "Browser does not support downloads. Please try this application in Chrome."
      );
    }
  }
}
