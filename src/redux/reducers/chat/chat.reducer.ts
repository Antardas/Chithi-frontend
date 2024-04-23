import { createSlice } from '@reduxjs/toolkit';
import { getConversationList } from '~/redux/api/chat';
import { IMessageList } from '~/types/chat';
import { IGetALlNotificationResponse } from '~/types/notification';

interface ChatStoreInitialState {
  chatList: IMessageList[];
  selectedChatUser: null;
  isLoading: boolean;
}

interface IAction {
  payload: unknown;
  type: string;
}

interface IAddToChatList extends IAction {
  payload: {
    isLoading: boolean;
    chatList: IMessageList[];
  };
}
interface ISetSelectedChatUser extends IAction {
  payload: {
    isLoading: boolean;
    user: null;
  };
}

const initialState: ChatStoreInitialState = {
  chatList: [],
  isLoading: false,
  selectedChatUser: null
};

const chatSlice = createSlice({
  initialState,
  name: 'chat',
  reducers: {
    addToChatList: (state, action: IAddToChatList) => {
      const { isLoading, chatList } = action.payload;
      state.chatList = [...chatList];
      state.isLoading = isLoading;
    },
    setSelectedChatUser: (state, action: ISetSelectedChatUser) => {
      const { isLoading, user } = action.payload;
      state.selectedChatUser = user;
      state.isLoading = isLoading;
    }
  },
  extraReducers(builder) {
    builder.addCase(getConversationList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      const data = action.payload?.data;
      if (data) {
        state.chatList = [...data];
      }
      state.isLoading = false;
    });
    builder.addCase(getConversationList.rejected, (state, action) => {
      state.isLoading = false;
    });
  }
});

export const { addToChatList, setSelectedChatUser } = chatSlice.actions;
export default chatSlice.reducer;
