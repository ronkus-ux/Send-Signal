import { getConversations, getConversationMessages } from '@/lib/actions/conversation';
import { InboxClient } from './inbox-client';

export default async function ConversationsPage() {
  const conversations = await getConversations();

  // Pre-fetch messages for all conversations to pass as initial state
  // In a massive app we'd load these lazily, but for Phase 10 we'll load them upfront for snappy UI
  const initialMessages: Record<string, any[]> = {};
  
  await Promise.all(
    conversations.map(async (conv) => {
      const msgs = await getConversationMessages(conv.id);
      initialMessages[conv.id] = msgs;
    })
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight">Inbox</h1>
        <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Manage replies and send manual follow-ups to your leads.</p>
      </div>
      
      <InboxClient 
        conversations={conversations} 
        initialMessages={initialMessages} 
      />
    </div>
  );
}
