function read_file(reader_action: (reader: FileReader) => void): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result!);
    reader.onerror = error => reject(error);
    reader_action(reader);
  });
}

export async function read_file_as_text(file: File): Promise<string> {
  return await read_file(reader => reader.readAsText(file)) as string;
}

export async function read_file_as_url(file: File): Promise<string> {
  return await read_file(reader => reader.readAsDataURL(file)) as string;
}

export function prompt_file(accept: string): Promise<File | null> {
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

export async function read_image_resized(file: File, maxWidth: number): Promise<string> {
  const dataUrl = await read_file_as_url(file);
  return await new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const factor = Math.min(1, maxWidth / width);
      width *= factor;
      height *= factor;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}
