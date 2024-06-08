import { createSlice } from '@reduxjs/toolkit';
import { getConversationList } from '~/redux/api/chat';
import { IMessageList } from '~/types/chat';
import { IGetALlNotificationResponse } from '~/types/notification';

interface ChatStoreInitialState {
	chatList: IMessageList[];
	selectedChatMessages: IMessageList[];
	conversationId: string;
  onlineUsers: string[];
  selectedChatUser: IMessageList | null;
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
    user: IMessageList | null;
  };
}

const initialState: ChatStoreInitialState = {
	chatList: [],
	selectedChatMessages: [],
	conversationId:'',
  onlineUsers: [],
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
		},
		setSelectedChatMessages: (state, action) => {
			state.selectedChatMessages = action.payload
		},
		setConversationId: (state, action) => {
			state.conversationId = action.payload
		},
    addOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(getConversationList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      const data = action.payload?.data;
      if (data) {
        const sortedData = data.sort((a, b) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          if (aDate < bDate) {
            return 1;
          } else if (aDate > bDate) {
            return -1;
          } else {
            return 0;
          }
        });


        state.chatList = [...sortedData];
      }
      state.isLoading = false;
    });
    builder.addCase(getConversationList.rejected, (state, action) => {
      state.isLoading = false;
    });
  }
});

export const { addToChatList, setSelectedChatUser, addOnlineUsers, setSelectedChatMessages, setConversationId } = chatSlice.actions;
export default chatSlice.reducer;
