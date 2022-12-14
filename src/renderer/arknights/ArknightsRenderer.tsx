import { MouseEventHandler } from "react";
import { useAppContext } from "../../model/AppContext";
import ChatItem from "../../model/ChatItem";
import { ArknightsChatItemType } from "../../model/props/ArknightsProps";
import { getConfig } from "../../utils/CtxUtils";
import RendererProps from "../RendererProps";
import { RendererType } from "../RendererType";
import "./Arknights.css";
import ArknightsConfig from "./ArknightsConfig";


function make_akn_header(content: string, click: () => void, contextMenu: MouseEventHandler) {
  return (
    <div className="akn-header">
      <div className="akn-header-left">DIALOGUE</div>
      <div className="akn-header-title" onClick={click} onContextMenu={contextMenu}>
        {content}
        <div className="akn-header-title-deco akn-header-title-deco-1"></div>
        <div className="akn-header-title-deco akn-header-title-deco-2"></div>
        <div className="akn-header-title-deco akn-header-title-deco-3"></div>
        <div className="akn-header-title-deco akn-header-title-deco-4"></div>
      </div>
      <div className="akn-header-right"></div>
    </div>
  );
}

function renderChoices(item: ChatItem, click: () => void, contextMenu: MouseEventHandler) {
  const choices = item.content.split("\n");
  return (
    <div className="akn-choices" onClick={click} onContextMenu={contextMenu}>
      {choices.map((text, idx) => (
        <div className="akn-choice" key={idx}>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 1" height="12px">
              <path d="M 0 0 L 0 1 L 0.866 0.5 z" fill="#999"></path>
              <path d="M 1 0 L 1 1 L 1.866 0.5 z" fill="#999"></path>
              <path d="M 2 0 L 2 1 L 2.866 0.5 z" fill="#999"></path>
            </svg>
          </span>
          <span className="text">{text}</span>
        </div>
      ))}
    </div>
  );
}

function renderSelection(item: ChatItem, click: () => void, contextMenu: MouseEventHandler) {
  return (
    <div className="akn-selection" onClick={click} onContextMenu={contextMenu}>
      <div className="akn-selection-content">
      <span className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 1" height="12px">
          <path d="M 0 0 L 0 1 L 0.866 0.5 z" fill="#999"></path>
          <path d="M 1 0 L 1 1 L 1.866 0.5 z" fill="#999"></path>
          <path d="M 2 0 L 2 1 L 2.866 0.5 z" fill="#999"></path>
        </svg>
      </span>
      <span className="text">{item.content}</span>
      <span className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 1" height="12px">
          <g transform="rotate(180 1.5 0.5)">
            <path d="M 0 0 L 0 1 L 0.866 0.5 z" fill="#999"></path>
            <path d="M 1 0 L 1 1 L 1.866 0.5 z" fill="#999"></path>
            <path d="M 2 0 L 2 1 L 2.866 0.5 z" fill="#999"></path>
          </g>
        </svg>
      </span>

      </div>
    </div>
  );
}

function renderNarration(item: ChatItem, click: () => void, contextMenu: MouseEventHandler) {
  return (
    <div className="akn-narration" onClick={click} onContextMenu={contextMenu}>
      {item.content}
    </div>
  );
}

function is_stamp(item: ChatItem): boolean {
  return item.arknights.type === ArknightsChatItemType.Image && !item.content.startsWith("data:image");
}

export default function ArknightsRenderer(props: RendererProps) {
  const ctx = useAppContext();
  const chat = props.chat;

  const config = getConfig(ArknightsConfig, ctx, RendererType.Arknights);

  let headerCounter = 0;

  const renderItem = (idx: number) => {
    const item = chat[idx];
    const itemProps = item.arknights;
    const type = itemProps.type;

    if (type === ArknightsChatItemType.SectionTitle) {
      // make part counter increasing sequentially
      headerCounter++;
      const title = item.content.trim().length === 0 ? `Part.${headerCounter.toString().padStart(2, "0")}` : item.content;
      return make_akn_header(title, () => props.click(item), (ev) => props.contextMenuCallback(ev.nativeEvent, item));
    }
    if (type === ArknightsChatItemType.Choices) {
      return renderChoices(item, () => props.click(item), (ev) => props.contextMenuCallback(ev.nativeEvent, item));
    }
    if (type === ArknightsChatItemType.Selection) {
      return renderSelection(item, () => props.click(item), (ev) => props.contextMenuCallback(ev.nativeEvent, item));
    }
    if (type === ArknightsChatItemType.Narration) {
      return renderNarration(item, () => props.click(item), (ev) => props.contextMenuCallback(ev.nativeEvent, item));
    }

    const avatarUrl = item.char?.character.get_url(item.char!.img) || "resources/renderer/ak/doctor.webp";

    let content: string | JSX.Element = "Not implemented";
    if (type === ArknightsChatItemType.Text || type === ArknightsChatItemType.Thoughts) {
      content = (
        <div className="akn-content-text">{item.content}</div>
      );
    }
    else if (type === ArknightsChatItemType.Image) {
      content = <img
        alt={"Image"}
        src={item.content}
        className={is_stamp(item) ? "akn-stamp" : ""}
      />;
    }

    const contentClasses = ["akn-content"];
    if (type === ArknightsChatItemType.Thoughts) {
      contentClasses.push("akn-content-thoughts")
    }
    return (
      <div className="akn-item">
        <div className="akn-avatar">
          <img alt={`Avatar of ${item.char?.character.get_short_name("en") || "player"}`} src={avatarUrl}></img>
        </div>
        <div className={contentClasses.join(" ")} onClick={() => props.click(item)} onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
          {content}
        </div>
      </div>
    );
  };

  const chatBgColor = config.bgColor;

  return (
    <div style={{
      backgroundColor: chatBgColor,
      minHeight: "100%",
    }}>
      <div id="chat-area" style={{
        backgroundColor: chatBgColor,
        paddingTop: "16px",
        paddingBottom: "16px",
      }}>
        {chat.map((_, idx) => (
          <div key={idx} className="chat-item">
            {idx !== props.insertIdx ? null :
              <div data-html2canvas-ignore className="akn-insert-indicator"></div>
            }
            {renderItem(idx)}
          </div>
        ))}
      </div>
    </div>
  );
}
