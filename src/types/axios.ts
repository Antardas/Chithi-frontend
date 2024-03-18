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

export type { IError, SuggestionResponse };
