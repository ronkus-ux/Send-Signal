'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { sendManualReply } from '@/lib/actions/conversation';
import { Send, User, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Lead = { first_name?: string | null; last_name?: string | null; phone_number: string };
type ConversationItem = {
  id: string;
  lead: Lead;
  last_message_at?: string | Date | null;
};
type Message = {
  id: string;
  conversation_id: string;
  direction: string;
  body: string;
  created_at: string | Date;
};

export function InboxClient({ 
  conversations, 
  initialMessages 
}: { 
  conversations: ConversationItem[], 
  initialMessages: Record<string, Message[]> 
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(conversations.length > 0 ? conversations[0].id : null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeId);
  const activeMessages = useMemo(() => {
    return activeId ? (messages[activeId] || []) : [];
  }, [activeId, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Polling for updates
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  // Update local state when props change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(prev => {
      const newMessages = { ...prev };
      for (const [convId, msgs] of Object.entries(initialMessages)) {
        if (!newMessages[convId] || newMessages[convId].length !== msgs.length) {
          newMessages[convId] = msgs;
        }
      }
      return newMessages;
    });
  }, [initialMessages]);

  const handleSend = async () => {
    if (!replyText.trim() || !activeId) return;
    
    setIsSending(true);
    const text = replyText.trim();
    setReplyText(''); // optimistic clear
    
    // Optimistic UI update
    const optimisticMsg: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: activeId,
      direction: 'OUTBOUND',
      body: text,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), optimisticMsg]
    }));

    const result = await sendManualReply(activeId, text);
    
    if (!result.success) {
      alert(result.error || 'Failed to send message');
    } else {
      router.refresh();
    }
    
    setIsSending(false);
  };

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] py-20 px-6 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] flex items-center justify-center text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-5">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] font-semibold">
          Conversations Coming Soon
        </h3>
        <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-2 max-w-md">
          A dedicated inbox for handling inbound replies to your campaigns is under development.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col">
        <div className="p-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-gray-50">
          <h2 className="font-semibold text-gray-700">Inbox</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`p-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] cursor-pointer transition-colors ${activeId === conv.id ? 'bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)]/10 border-l-4 border-l-[var(--sys-color-roles-1-primary-roles-primary-color-role)]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-gray-900 truncate pr-2">
                  {conv.lead.first_name ? `${conv.lead.first_name} ${conv.lead.last_name || ''}` : conv.lead.phone_number}
                </span>
                {conv.last_message_at && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(conv.last_message_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {conv.lead.phone_number}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeId ? (
        <div className="flex-1 flex flex-col bg-[#efeae2]">
          {/* Header */}
          <div className="p-4 bg-white border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex items-center z-10">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {activeConversation?.lead.first_name ? `${activeConversation.lead.first_name} ${activeConversation.lead.last_name || ''}` : activeConversation?.lead.phone_number}
              </h3>
              <p className="text-xs text-gray-500">{activeConversation?.lead.phone_number}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map((msg) => {
              const isOutbound = msg.direction === 'OUTBOUND';
              return (
                <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                      isOutbound 
                        ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                    <div className="text-[10px] text-gray-500 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-[#f0f2f5] border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message"
                className="flex-1 rounded-full border-none py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[var(--sys-color-roles-1-primary-roles-primary-color-role)] shadow-sm"
                disabled={isSending}
              />
              <button
                onClick={handleSend}
                disabled={!replyText.trim() || isSending}
                className="p-3 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#efeae2]">
          <div className="text-center text-gray-500">
            <p>Select a conversation to view messages</p>
          </div>
        </div>
      )}
    </div>
  );
}
