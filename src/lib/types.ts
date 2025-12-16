import type { ExtendedRecordMap } from "notion-types";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  cover: string | null;
  published: boolean;
}

export interface BlogPostWithContent extends BlogPost {
  recordMap: ExtendedRecordMap | null;
}
