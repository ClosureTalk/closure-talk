export function trigger_download(url: string, filename: string) {
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.setAttribute("download", filename);
  link.setAttribute("href", url);
  link.click();
  document.body.removeChild(link);
}

export function download_text(text: string, filename: string) {
  const blob = new Blob([text], {
    type:"text/plain;charset=UTF-8"
  });
  trigger_download(URL.createObjectURL(blob), filename);
}
