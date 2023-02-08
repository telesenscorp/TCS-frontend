export default function uploadFile(fn) {
  let fileInput = document.createElement("input");
  function readFile(e) {
    let file = e.target.files[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      fn(e.target.result);
      document.body.removeChild(fileInput);
    };
    reader.readAsText(file);
  }
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.style.display = "none";
  fileInput.onchange = readFile;
  document.body.appendChild(fileInput);
  fileInput.click();
}
