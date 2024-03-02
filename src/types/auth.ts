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

interface IForgetPasswordRes {
  message: string;
}

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export type { ISignupData, ISignInData, IForgetPasswordRes, ResetPasswordData };
