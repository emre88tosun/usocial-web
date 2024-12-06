import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';
import safeString from '@helpers/safeString';

type SidebarContentProps = {
  readonly onSelectionChange?: () => void;
};

export default function SidebarContent(props: SidebarContentProps) {
  const { onSelectionChange } = props;
  const { pathname } = useLocation();
  const routeDictionary: Record<string, string> = {
    '': '/',
    chats: '/chats',
  };
  return (
    <Tabs
      selectedKey={
        safeString(pathname.split('/').at(1)) in routeDictionary
          ? routeDictionary[safeString(pathname.split('/').at(1))]
          : safeString(pathname.split('/').at(1))
      }
      placement="start"
      variant="underlined"
      color="primary"
      size="lg"
      onSelectionChange={onSelectionChange}
      classNames={{
        tab: '!px-0 !justify-start w-full',
        tabList: '!px-0',
        tabContent: 'text-xl font-bold text-zinc-900 dark:text-white',
      }}
    >
      <Tab key="/" href="/" title="Discover" />
      <Tab key="/chats" href="/chats" title="Chats" />
    </Tabs>
  );
}
