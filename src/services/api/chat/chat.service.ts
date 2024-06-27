import axios from '~/services/axios';
import { GetConversationList, IConversationUsers, IMarkMessageAsDeleted, ISendMessageBody, IUpdateMessageReaction } from '~/types/chat';

class ChatService {
  async getConversationList() {
    const response = await axios.get<GetConversationList>('/chat/message/conversation');
    return response;
  }
  async addChatUsers(body: IConversationUsers) {
    console.log(`🚀 ~ ChatService ~ addChatUsers ~ body:`, body);
    const response = await axios.post<GetConversationList>('/chat/message/users', body);
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
  async updateMessageReaction(body: IUpdateMessageReaction) {
    const response = await axios.put<GetConversationList>(`/chat/message/reaction`, body);
    return response;
  }
  async markMessageAsDeleted(body: IMarkMessageAsDeleted) {
    const { messageId, receiverId, senderId, type } = body;
    const response = await axios.delete<GetConversationList>(`/chat/message/${messageId}/${senderId}/${receiverId}/${type}`);
    return response;
  }
}

export const chatService: ChatService = new ChatService();
