// Function to download data to a file
export function download(data: string, filename: string, type: string) {
  var a = document.createElement("a"),
    file = new Blob([data], { type: type });
  var url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
