import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel['id']>;
  enabled?: boolean;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: ['chat-model'],
    enabled: false,
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 1000000,
    availableChatModelIds: ['chat-model'],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
