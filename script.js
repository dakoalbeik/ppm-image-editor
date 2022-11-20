const reader = new FileReader();
const filePicker = document.getElementById("file-picker");
filePicker.addEventListener("change", ({ target }) => {
  reader.addEventListener("load", ({ target }) => {
    console.log(target.result);
  });
  reader.readAsText(target.files[0]);
});
