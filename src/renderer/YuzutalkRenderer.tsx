import { useAppContext } from "../model/AppContext";
import { ChatItemAvatarType } from "../model/ChatItemAvatarType";
import { ChatItemType } from "../model/ChatItemType";
import RendererProps from "./RendererProps";
import "./Yuzutalk.css"

export default function YuzutalkRenderer(props: RendererProps) {
  const ctx = useAppContext();
  const chat = props.chat;

  const renderItem = (idx: number) => {
    const item = chat[idx];

    if (item.type === ChatItemType.Character) {
      const showAvatar = idx === 0 ||
      item.avatar === ChatItemAvatarType.Show ||
      chat[idx-1].char?.get_id() !== item.char!.get_id();

      return (
        <div className="yuzu-item">
          <div className="yuzu-left">
            {!showAvatar? null :
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
              <div className="yuzu-message" onClick={() => props.click(item)} onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
                {item.content}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (item.type === ChatItemType.Player) {
      return (
        <div className="yuzu-item yuzu-player-item">
          <div className="yuzu-message-box yuzu-player-message-box">
            <div className="yuzu-message" onClick={() => props.click(item)} onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
              {item.content}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>Wait</div>
    )
  }

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
  )
}
