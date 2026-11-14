export interface GuestbookUser {
  id?: string;
  name?: string | null;
  username: string;
  image?: string | null;
  isAdmin?: boolean;
}

export interface GuestbookEntryItem {
  id: string;
  userId: string;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  user: GuestbookUser;
  isOptimistic?: boolean;
}
