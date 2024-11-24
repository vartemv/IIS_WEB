export interface Group {
    group_name: string;
    pocet: number;
    owner: number;
    datum: Date;
    photo: string;
    user_status: string;
    users: {profile_name: string}
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
    users: {profile_name: string, photo: string}
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

  interface GroupUser extends CommentUsersPhoto{
    profile_name: string;
    id: number;
  }

  interface GroupInfo {
    group_name: string;
    pocet: number;
    photo: string;
    owner: number;
    datum: Date;
  }

  interface UserStatus {
    user_id: number;
    status: string;
    group_name: string;
  }