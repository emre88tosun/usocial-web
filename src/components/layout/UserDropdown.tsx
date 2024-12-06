import React from 'react';
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
  useDisclosure,
} from '@nextui-org/react';
import getInitials from '@helpers/getInitials';
import safeString from '@helpers/safeString';
import useAuthActions from '@hooks/auth/useAuthActions';
import useMe from '@hooks/auth/useMe';
import { IconDiamond, IconSparkles } from '@tabler/icons-react';
import BuyGemsModal from '@components/organisms/BuyGemsModal';
import LetsShineModal from '@components/organisms/LetsShineModal';

type Props = {
  triggerClassName?: string;
};

export default function UserDropdown(props: Props) {
  const { triggerClassName } = props;
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'buyGemsModal' });
  const {
    isOpen: isShineOpen,
    onOpen: onShineOpen,
    onClose: onShineClose,
  } = useDisclosure({ id: 'shineModal' });
  const { data: user } = useMe();
  const { logOut } = useAuthActions();
  return (
    <>
      <Dropdown
        placement="bottom-end"
        classNames={{
          content: 'w-min',
          trigger: cn({
            [safeString(triggerClassName)]: !!triggerClassName,
          }),
        }}
      >
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            {...(user && {
              fallback: (
                <span className="font-bold">
                  {getInitials(safeString(user.name))}
                </span>
              ),
            })}
            size="sm"
            color="primary"
            showFallback
            isBordered
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          onAction={(key) => {
            if (key === 'logout') {
              logOut();
            }
            if (key === 'gems') {
              onOpen();
            }
            if (key === 'become') {
              onShineOpen();
            }
          }}
          variant="flat"
          color="primary"
        >
          <DropdownItem
            className={cn('text-zinc-900 dark:text-white', {
              hidden: safeString(user?.role?.name) !== 'standard user',
            })}
            color="primary"
            key="gems"
            startContent={<IconDiamond />}
          >
            {`${Number(user?.gem_data?.amount ?? 0)} Gems`}
          </DropdownItem>
          <DropdownItem
            className={cn('text-zinc-900 dark:text-white', {
              hidden: safeString(user?.role?.name) !== 'standard user',
            })}
            color="primary"
            key="become"
            startContent={<IconSparkles />}
          >
            Let&apos;s Shine!
          </DropdownItem>
          <DropdownItem
            className="text-zinc-900 dark:text-white"
            color="danger"
            key="logout"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {isOpen && <BuyGemsModal isOpen={isOpen} onClose={onClose} />}
      {isShineOpen && (
        <LetsShineModal isOpen={isShineOpen} onClose={onShineClose} />
      )}
    </>
  );
}
