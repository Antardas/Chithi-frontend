import { createAsyncThunk } from '@reduxjs/toolkit';
import { Utils } from '~/services/utils/utils.service';
import { AppDispatch } from '../store';
import { chatService } from '~/services/api/chat/chat.service';

const getConversationList = createAsyncThunk('chat/getChatList', async (_nothing, thunkAPI) => {
  try {
    const response = await chatService.getConversationList();
    return response.data;
    return null;
  } catch (error) {
    Utils.addErrorNotification(error, thunkAPI.dispatch as AppDispatch);
  }
});

export { getConversationList };
