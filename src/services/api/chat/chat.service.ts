import axios from '~/services/axios';
import { GetConversationList, IConversationUsers } from '~/types/chat';

class ChatService {
  async getConversationList() {
    const response = await axios.get<GetConversationList>('/chat/message/conversation');
    return response;
  }
  async addChatUsers(body: IConversationUsers) {
    const response = await axios.post<GetConversationList>('chat/message/users', body);
    return response;
  }
  async removeChatUser(body: IConversationUsers) {
    const response = await axios.post<GetConversationList>('chat/message/remove-users', body);
    return response;
  }
}

export const chatService: ChatService = new ChatService();
