export interface UserList {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  friends: UserList[] | null;
  redesSociales?: string[] | null;
}

export const mockUser: UserList = {
  email: 'esther.romeagui@gmail.com',
  displayName: 'Esther Romero Aguilar',
  photoURL: '',
  redesSociales: ['facebook', 'instagram', 'twitter'],
  friends: [
    {
      email: 'gatito@gmail.com',
      displayName: 'Gatito',
      photoURL: '',
      friends: [],
      redesSociales: ['facebook', 'instagram', 'twitter'],
    },
    {
      email: 'perrito@gmail.com',
      displayName: 'Perrito',
      photoURL: '',
      friends: [],
    },
    {
      email: 'gatito@gmail.com',
      displayName: 'Gatito',
      photoURL: '',
      friends: [],
    },
    {
      email: 'perrito@gmail.com',
      displayName: 'Perrito',
      photoURL: '',
      friends: [],
    },
    {
      email: 'gatito@gmail.com',
      displayName: 'Gatito',
      photoURL: '',
      friends: [],
    },
  ],
};
