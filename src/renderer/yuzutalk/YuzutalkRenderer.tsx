import { useTranslation } from "react-i18next";
import { useAppContext } from "../../model/AppContext";
import ChatItem from "../../model/ChatItem";
import { YuzutalkChatItemAvatarState, YuzutalkChatItemType } from "../../model/props/YuzutalkProps";
import { getConfig } from "../../utils/CtxUtils";
import RendererProps from "../RendererProps";
import { RendererType } from "../RendererType";
import "./Yuzutalk.css";
import YuzutalkConfig, { YuzutalkTheme } from "./YuzutalkConfig";

function is_stamp(item: ChatItem): boolean {
  return item.yuzutalk.type === YuzutalkChatItemType.Image && !item.content.startsWith("data:image");
}


export default function YuzutalkRenderer(props: RendererProps) {
  const ctx = useAppContext();
  const { t } = useTranslation();
  const chat = props.chat;
  const config = getConfig(YuzutalkConfig, ctx, RendererType.Yuzutalk);

  const getName = (item: ChatItem) => {
    return item.yuzutalk.nameOverride.length > 0 ?
      item.yuzutalk.nameOverride :
      item.char?.character.get_short_name(ctx.lang) || t("yuzu-sensei") as string;
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
        onClick={(ev) => props.click(ev.nativeEvent, item)}
        onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
        {content}
      </div>
    );
  };

  const renderKizunaItem = (item: ChatItem) => {
    const name = getName(item);
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

  const renderNarrationItem = (item: ChatItem) => {
    return renderSpecialItem(item, (
      <div className="yuzu-narration-item">
        <span className="text">{item.content}</span>
      </div>
    ))
  }

  const renderItem = (idx: number) => {
    const item = chat[idx];
    const boxClasses = [];
    const itemProps = item.yuzutalk;
    const type = itemProps.type;

    if (type === YuzutalkChatItemType.RelationshipStory) {
      return renderKizunaItem(item);
    }
    if (type === YuzutalkChatItemType.Choices) {
      return renderReplyItem(item);
    }
    if (type === YuzutalkChatItemType.Narration) {
      return renderNarrationItem(item);
    }

    let content: string | JSX.Element = "Not implemented";
    if (type === YuzutalkChatItemType.Text) {
      content = item.content;
      boxClasses.push("yuzu-message-box");
    }
    else if (type === YuzutalkChatItemType.Image) {
      content = <img alt={is_stamp(item) ? "Stamp" : "Uploaded image"} src={item.content} />;
      boxClasses.push("yuzu-image-box");
      if (is_stamp(item)) {
        boxClasses.push("yuzu-stamp");
      }
    }

    content = (
      <div
        className="yuzu-message"
        onClick={(ev) => props.click(ev.nativeEvent, item)}
        onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
        {content}
      </div>
    );

    if (item.char !== null) {
      let showAvatar = idx === 0 || itemProps.avatarState === YuzutalkChatItemAvatarState.Show;
      if (idx > 0) {
        const prev = chat[idx - 1];
        const prevType = prev.yuzutalk.type;
        showAvatar ||=
          prevType !== YuzutalkChatItemType.Text && prevType !== YuzutalkChatItemType.Image ||
          prev.char?.get_id() !== item.char!.get_id();
      }

      if (type === YuzutalkChatItemType.Text && showAvatar) {
        boxClasses.push("yuzu-avatar-message-box");
      }

      return renderCharacterItem(item, showAvatar, boxClasses, content);
    }
    else {
      boxClasses.push("yuzu-player-box");
      return renderPlayerItem(content, boxClasses);
    }
  };

  const chatBgColor = config.theme === YuzutalkTheme.Yuzutalk ? "rgb(255, 247, 225)" : "white";

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
