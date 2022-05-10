import ChatItem from "../model/ChatItem";
import ArknightsRenderer from "./ArknightsRenderer";
import { RendererType } from "./RendererType";
import YuzutalkRenderer from "./YuzutalkRenderer";

export function render_chat(type: RendererType, chat: ChatItem[], clickCallback: (item: ChatItem) => void, contextMenuCallback: (ev: MouseEvent, item: ChatItem) => void, insertIdx: number) {
  switch (type) {
    case RendererType.Arknights:
      return (
        <ArknightsRenderer chat={chat} click={clickCallback} contextMenuCallback={contextMenuCallback} insertIdx={insertIdx} />
      );
    case RendererType.Yuzutalk:
      return (
        <YuzutalkRenderer chat={chat} click={clickCallback} contextMenuCallback={contextMenuCallback} insertIdx={insertIdx} />
      );
  }
}
