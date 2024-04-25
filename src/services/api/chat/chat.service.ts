import axios from '~/services/axios';
import { GetConversationList, IConversationUsers, ISendMessageBody } from '~/types/chat';

class ChatService {
  async getConversationList() {
    const response = await axios.get<GetConversationList>('/chat/message/conversation');
    return response;
  }
  async addChatUsers(body: IConversationUsers) {
    const response = await axios.post<GetConversationList>('chat/message/users', body);
    return response;
  }
  /**
   * This will take the id of user not username
   * @param body
   * @returns
   */
  async markAsRead(body: IConversationUsers) {
    const response = await axios.put<GetConversationList>('/chat/message/mark-read', body);
    return response;
  }
  async removeChatUser(body: IConversationUsers) {
    const response = await axios.post<GetConversationList>('/chat/message/remove-users', body);
    return response;
  }
  async getChatMessages(receiverId: string) {
    const response = await axios.get<GetConversationList>(`/chat/message/user/${receiverId}`);
    return response;
  }
  async sendChatMessage(body: ISendMessageBody) {
    const response = await axios.post<GetConversationList>(`/chat/message`, body);
    return response;
  }
}

export const chatService: ChatService = new ChatService();
