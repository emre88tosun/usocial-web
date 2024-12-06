import React from 'react';
import { CometChatConversationsWithMessages } from '@cometchat/chat-uikit-react';
import { useMediaQuery } from 'usehooks-ts';

export default function Chats() {
  const isMobileView = useMediaQuery('(max-width: 576px)');
  return (
    <div className="flex h-[calc(100vh-90px)] w-full flex-col gap-4 overflow-hidden">
      <CometChatConversationsWithMessages isMobileView={isMobileView} />
    </div>
  );
}
