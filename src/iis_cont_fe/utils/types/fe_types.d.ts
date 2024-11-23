export interface Group {
    group_name: string;
    pocet: number;
    owner: string;
    datum: Date;
  }

  interface Post {
    id: number;
    user_id: number;
    mediafile: string;
    description: string;
    location: string;
    datetime: string;
    availability: boolean;
    comments: Comment[];
    post_tags: PostTag[];
    reactions: Reaction[];
  }
  
  interface Comment {
    id: number;
    post_id: number;
    content: string;
    author: string;
    datetime: string;
    users: CommentUsersPhoto;
  }

  interface CommentUsersPhoto {
    photo: string;
  }
  
  interface PostTag {
    post_id: number;
    tag_id: number;
    tags: Tag;
  }
  
  interface Tag {
    id: number;
    name: string;
  }
  
  interface Reaction {
    id: number;
    post_id: number;
    amount: number;
  }