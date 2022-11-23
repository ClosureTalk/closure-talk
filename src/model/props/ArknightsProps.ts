export enum ArknightsChatItemType {
  Text = "TEXT",
  Image = "IMAGE",
  SectionTitle = "SECTIONTITLE",
  Choices = "CHOICES",
  Selection = "SELECTION",
  Narration = "NARRATION",
}

export class ArknightsChatItemProps {
  type = ArknightsChatItemType.Text;

  constructor(obj: Partial<ArknightsChatItemProps> | null | undefined = {}) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
