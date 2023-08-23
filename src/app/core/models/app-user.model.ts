export interface AppUser {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  friends: string[] | null;
  score: number | null;
}
