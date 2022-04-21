import { Tag } from "./tag";
import { User } from "./users";

export type Note = {
  title: string;
  content: string;
  createDate?: string;
  tags?: Tag;
  id?: number;
};
