import { ChatConversation, ChatMessage, PaginatedResponse } from '../types';
import { MOCK_USER_ID } from '../constants';

const API_BASE_URL = '/api';

export const getConversations = async (params: { q?: string, page?: number, limit?: number }): Promise<PaginatedResponse<ChatConversation>> => {
    const token = localStorage.getItem('authToken');
    const url = new URL(`${API_BASE_URL}/chat/conversations`);
    if (params.q) url.searchParams.append('q', params.q);
    if (params.page) url.searchParams.append('page', String(params.page));
    if (params.limit) url.searchParams.append('limit', String(params.limit));
    const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const result = await res.json();
    return {
        data: result.data.data,
        meta: result.data.meta
    };
};

export const getConversationMessages = async (conversationId: string, params: { before_message_id?: string, limit?: number }): Promise<ChatMessage[]> => {
    const token = localStorage.getItem('authToken');
    const url = new URL(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`);
    if (params.before_message_id) url.searchParams.append('before_message_id', params.before_message_id);
    if (params.limit) url.searchParams.append('limit', String(params.limit));
    const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    const result = await res.json();
    return result.data;
};

export const sendMessage = async (payload: { receiver_id?: number, conversation_id?: string | number, message_content: string, message_type?: string, related_product_id?: number, related_rental_id?: number }): Promise<ChatMessage> => {
    const token = localStorage.getItem('authToken');
    const body: any = {
      message_content: payload.message_content
    };
    if (payload.receiver_id) body.receiver_id = payload.receiver_id;
    if (payload.conversation_id) body.conversation_id = payload.conversation_id;
    if (payload.related_product_id) body.related_product_id = payload.related_product_id;
    if (payload.related_rental_id) body.related_rental_id = payload.related_rental_id;
    if (payload.message_type) body.message_type = payload.message_type;
    const res = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to send message');
    const result = await res.json();
    return result.data;
};

export const markMessagesAsRead = async (conversationId: string): Promise<{ success: boolean }> => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages/read`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: '{}'
    });
    if (!res.ok) throw new Error('Failed to mark messages as read');
    const result = await res.json();
    return result.data;
};

// Temporary mock user database for chat service context
const mockUserDatabaseTemp: any = {
    [MOCK_USER_ID]: { id: MOCK_USER_ID, first_name: "Current User", last_name: '', profile_picture_url: undefined },
    2: { id: 2, first_name: "Jane D.", last_name: '', profile_picture_url: "https://picsum.photos/seed/user2/50/50" },
    3: { id: 3, first_name: "Mike B.", last_name: '', profile_picture_url: "https://picsum.photos/seed/user3/50/50" },
};
