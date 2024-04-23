import axios from '~/services/axios';
import { GetConversationList } from '~/types/chat';

class ChatService {
  async getConversationList() {
    const response = await axios.get<GetConversationList>('/chat/message/conversation');
    return response;
  }
}

export const chatService: ChatService = new ChatService();
