import { useTranslation } from "react-i18next";
import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";
import { ChatItemType } from "../model/ChatItemType";
import RendererProps from "./RendererProps";
import "./Yuzutalk.css";

export default function YuzutalkRenderer(props: RendererProps) {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const chat = props.chat;

  const getName = (item: ChatItem) => {
    return item.nameOverride.length > 0 ?
      item.nameOverride :
      item.char?.character.get_short_name(ctx.lang);
  };

  const renderCharacterItem = (item: ChatItem, showAvatar: boolean, boxClasses: string[], content: JSX.Element) => {
    return (
      <div className="yuzu-item">
        <div className="yuzu-left">
          {!showAvatar ? null :
            <div className="yuzu-avatar-box">
              <img alt={`Avatar of ${item.char!.character.get_short_name("en")}`} src={item.char!.character.get_url(item.char!.img)}></img>
            </div>
          }
        </div>
        <div className="yuzu-right">
          {!showAvatar ? null :
            <div className="yuzu-name">{getName(item)}</div>
          }
          <div className={boxClasses.join(" ")}>
            {content}
          </div>
        </div>
      </div>
    );
  };

  const renderPlayerItem = (content: JSX.Element, boxClasses: string[]) => (
    <div className="yuzu-item yuzu-player-item">
      <div className={boxClasses.join(" ")}>
        {content}
      </div>
    </div>
  );

  const renderSpecialItem = (item: ChatItem, content: JSX.Element) => {
    return (
      <div
        className="yuzu-item yuzu-special-item"
        onClick={() => props.click(item)}
        onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
        {content}
      </div>
    );
  };

  const renderKizunaItem = (item: ChatItem) => {
    const name = getName(item)!;
    return renderSpecialItem(item, (
      <div className="yuzu-kizuna-item">
        <div className="yuzu-kizuna-header">
          <span className="text">{t("yuzu-kizuna-title")}</span>
        </div>
        <div className="yuzu-kizuna-heart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" height="100%"><path d="M58.5 8.2a18.7 18.7 0 00-26.5 0 18.7 18.7 0 00-26.5 0 18.7 18.7 0 000 26.5L32 61.3l26.5-26.6a18.7 18.7 0 000-26.5z" fill="#FFD1DB"></path></svg>
        </div>
        <div className="yuzu-kizuna-footer">
          <span className="text">{t("yuzu-kizuna-text").replace("{}", name)}</span>
        </div>
      </div>
    ));
  };

  const renderReplyItem = (item: ChatItem) => {
    const choices = item.content.split("\n");

    return renderSpecialItem(item, (
      <div className="yuzu-reply-item">
        <div className="yuzu-reply-header">
          <span className="text">{t("yuzu-reply-title")}</span>
        </div>
        <div className="yuzu-reply-choices">
          {choices.map((s, idx) => (
            <div key={idx} className="yuzu-reply-choice">
              <span className="text">{s}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const renderItem = (idx: number) => {
    const item = chat[idx];
    const boxClasses = [];

    if (item.type === ChatItemType.Special) {
      return item.char !== null ? renderKizunaItem(item) : renderReplyItem(item);
    }

    let content: string | JSX.Element = "Not implemented";
    if (item.type === ChatItemType.Text) {
      content = item.content;
      boxClasses.push("yuzu-message-box");
    }
    else if (item.type === ChatItemType.Image) {
      content = <img alt={item.is_stamp() ? "Stamp" : "Uploaded image"} src={item.content} />;
      boxClasses.push("yuzu-image-box");
      if (item.is_stamp()) {
        boxClasses.push("yuzu-stamp");
      }
    }

    content = (
      <div
        className="yuzu-message"
        onClick={() => props.click(item)}
        onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
        {content}
      </div>
    );

    if (item.char !== null) {
      const showAvatar = idx === 0 ||
        item.avatar === ChatItemAvatarType.Show ||
        chat[idx - 1].type === ChatItemType.Special ||
        chat[idx - 1].char?.get_id() !== item.char!.get_id();
      if (item.type === ChatItemType.Text && showAvatar) {
        boxClasses.push("yuzu-avatar-message-box");
      }

      return renderCharacterItem(item, showAvatar, boxClasses, content);
    }
    else {
      boxClasses.push("yuzu-player-box");
      return renderPlayerItem(content, boxClasses);
    }
  };

  const chatBgColor = "rgb(255, 247, 225)";

  return (
    <div style={{
      backgroundColor: chatBgColor,
      minHeight: "100%",
    }}>
      <div id="chat-area" style={{
        backgroundColor: chatBgColor,
        paddingTop: "8px",
        paddingBottom: "16px",
      }}>
        {chat.map((_, idx) => (
          <div key={idx} className="chat-item">
            {idx !== props.insertIdx ? null :
              <div data-html2canvas-ignore className="yuzu-insert-indicator"></div>
            }
            {renderItem(idx)}
          </div>
        ))}
      </div>
    </div>
  );
}
