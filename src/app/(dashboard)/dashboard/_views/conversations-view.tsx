'use client';

import React, { useEffect, useState } from 'react';
import { fetchConversationsData } from '@/lib/actions/dashboard';
import { InboxClient } from '../conversations/inbox-client';

export function ConversationsView() {
  const [data, setData] = useState<{ conversations: any[]; initialMessages: Record<string, any[]> } | null>(null);

  useEffect(() => {
    fetchConversationsData().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-4">
        <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Conversations</h1>
        <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Manage one-on-one chats with your leads.</p>
      </div>
      
      <InboxClient 
        conversations={data.conversations} 
        initialMessages={data.initialMessages} 
      />
    </div>
  );
}
