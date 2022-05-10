import { useAppContext } from "../model/AppContext";
import ChatItem from "../model/ChatItem";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";
import { ChatItemType } from "../model/ChatItemType";
import RendererProps from "./RendererProps";
import "./Yuzutalk.css";

export default function YuzutalkRenderer(props: RendererProps) {
  const ctx = useAppContext();
  const chat = props.chat;

  const renderCharacterItem = (item: ChatItem, showAvatar: boolean, boxClasses: string[], content: JSX.Element) => {
    const name = item.nameOverride.length > 0 ?
                  item.nameOverride :
                  item.char!.character.get_short_name(ctx.lang);

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
            <div className="yuzu-name">{name}</div>
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

  const renderItem = (idx: number) => {
    const item = chat[idx];
    const boxClasses = [];

    let content: string | JSX.Element = "Not implemented";
    if (item.type === ChatItemType.Text) {
      content = item.content;
      boxClasses.push("yuzu-message-box");
    }
    else if (item.type === ChatItemType.Image) {
      content = <img src={item.content} />;
      boxClasses.push("yuzu-image-box");
      if (item.is_stamp()) {
        boxClasses.push("yuzu-stamp")
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
