import { trigger_download } from "./DownloadUtils";
import { toPng } from "html-to-image";

export async function capture_and_save(id: string, filename: string, resize: boolean=false) {
  const node = document.getElementById(id)!;
  const url = await toPng(node);
  trigger_download(url, filename);
}
