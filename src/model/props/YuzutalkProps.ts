export enum YuzutalkChatItemType {
  Text = "TEXT",
  Image = "IMAGE",
  Choices = "CHOICES",
  RelationshipStory = "RELATIONSHIPSTORY",
  Narration = "NARRATION",
}

export enum YuzutalkChatItemAvatarState {
  Auto = "AUTO",
  Show = "SHOW",
  Hide = "HIDE",
}

export class YuzutalkChatItemProps {
  type = YuzutalkChatItemType.Text;
  avatarState = YuzutalkChatItemAvatarState.Auto;
  nameOverride = "";

  constructor(obj: Partial<YuzutalkChatItemProps> | null | undefined = {}) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
