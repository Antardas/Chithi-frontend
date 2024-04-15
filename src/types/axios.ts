import { IUser } from '~/types/user';
interface IError {
  message: string;
  statusCode: number;
  status: string;
}

interface SuggestionResponse {
  message: string;
  data: IUser[];
}

interface OnlyMessageResponse {
  message: string;
}

export type { IError, SuggestionResponse, OnlyMessageResponse };
