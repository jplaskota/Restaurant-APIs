import { Tag } from "./tag";

export type Note = {
  title: string;
  content: string;
  createDate?: string;
  tags?: Tag;
  id?: number;
};
