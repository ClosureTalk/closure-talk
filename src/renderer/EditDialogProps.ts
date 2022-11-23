import ChatItem from "../model/ChatItem";

export default class EditDialogProps {
  editing: ChatItem | null = null;
  setEditingNull = () => { };
  chat: ChatItem[] = [];
  setChat = (list: ChatItem[]) => { };
  setInsertIdx = (idx: number) => { };
}
