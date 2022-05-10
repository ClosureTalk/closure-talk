import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";
import { ChatItemType } from "../model/ChatItemType";
import RendererProps from "./RendererProps";
import "./Yuzutalk.css";

export default function YuzutalkRenderer(props: RendererProps) {
  const ctx = useAppContext();
  const chat = props.chat;

  const renderCharacterItem = (item: ChatItem, showAvatar: boolean, content: JSX.Element) => {
    return (
      <div className="yuzu-item">
        <div className="yuzu-left">
          {!showAvatar ? null :
            <div className="yuzu-avatar-box">
              <img src={item.char!.character.get_url(item.char!.img)}></img>
            </div>
          }
        </div>
        <div className="yuzu-right">
          {!showAvatar ? null :
            <div className="yuzu-name">{item.char!.character.get_short_name(ctx.lang)}</div>
          }
          <div className={"yuzu-message-box " + (showAvatar ? "yuzu-avatar-message-box" : "")}>
            {content}
          </div>
        </div>
      </div>
    );
  };

  const renderPlayerItem = (content: JSX.Element) => (
    <div className="yuzu-item yuzu-player-item">
      <div className="yuzu-message-box yuzu-player-message-box">
        {content}
      </div>
    </div>
  );

  const renderItem = (idx: number) => {
    const item = chat[idx];

    let content: string | JSX.Element = "Not implemented";
    if (item.type === ChatItemType.Text) {
      content = item.content;
    }
    else if (item.type === ChatItemType.Image) {
      content = <img src={item.content} />;
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
        chat[idx - 1].char?.get_id() !== item.char!.get_id();

      return renderCharacterItem(item, showAvatar, content);
    }
    else {
      return renderPlayerItem(content);
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
