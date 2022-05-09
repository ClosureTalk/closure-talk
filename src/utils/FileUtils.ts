export async function read_file(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = event => resolve(event.target!.result as string);
    fileReader.onerror = error => reject(error);
    fileReader.readAsText(file);
  });
}
