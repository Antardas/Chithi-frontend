import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '~/services/api/user/user.service';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { Utils } from '~/services/utils/utils.service';
import { IError, SuggestionResponse } from '~/types/axios';
import { AppDispatch } from '../store';

const getSuggestions = createAsyncThunk('user/getSuggestions', async (_name: string, { dispatch }) => {
  try {
    const response: AxiosResponse<SuggestionResponse> = await userService.getUserSuggestion();

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const typedError: AxiosError<IError> = error;
      const message = typedError?.response?.data?.message || 'Something went wrong';
      Utils.dispatchNotification(message, 'error', dispatch as AppDispatch);
    } else {
      Utils.dispatchNotification((error as Error).message, 'error', dispatch as AppDispatch);
    }
  }
});

export { getSuggestions };
