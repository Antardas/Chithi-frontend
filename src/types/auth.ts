interface ISignupData {
  username: string;
  password: string;
  email: string;
  avatarColor: string;
  avatarImage: string;
}

interface ISignInData {
  username: string;
  password: string;
  keepLoggedIn: boolean;
}

export type { ISignupData, ISignInData };
