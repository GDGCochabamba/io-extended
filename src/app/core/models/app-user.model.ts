export interface AppUser {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  facebookUsername: string;
  instagramUsername: string;
  twitterUsername: string;
  githubUsername: string;
  linkedinUsername: string;
  friends: string[] | null;
  score: number | null;
}
