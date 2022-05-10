export async function read_file_as_text(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = event => resolve(event.target!.result as string);
    fileReader.onerror = error => reject(error);
    fileReader.readAsText(file);
  });
}

export function prompt_file(accept: string): Promise<File|null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "file";
    input.style.display = "hidden";
    input.setAttribute("accept", accept);
    document.body.appendChild(input);

    input.addEventListener("change", () => {
      document.body.removeChild(input);

      if ((input.files?.length ?? 0) === 1) {
        resolve(input.files![0]);
      }
      else {
        resolve(null);
      }
    });

    input.click();
  });
}
