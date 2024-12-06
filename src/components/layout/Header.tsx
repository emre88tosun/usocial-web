import React from 'react';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from '@nextui-org/react';
import {
  IconMenu2,
  IconX,
  IconSunFilled,
  IconMoonFilled,
} from '@tabler/icons-react';
import UserDropdown from './UserDropdown';
import { useToggle } from 'usehooks-ts';
import SidebarContent from './SidebarContent';
import useSkin from '@hooks/common/useSkin';

export default function Header() {
  const [on, , toggle] = useToggle(false);
  const { skin, setSkin } = useSkin();
  return (
    <Navbar
      isBordered
      isBlurred
      maxWidth="xl"
      onMenuOpenChange={toggle}
      isMenuOpen={on}
      className="overflow-hidden"
      classNames={{
        wrapper: '!pe-6 !ps-4',
      }}
    >
      <NavbarContent justify="center">
        <NavbarMenuToggle
          className="text-zinc-900 dark:text-white md:!hidden"
          aria-label={on ? 'Close menu' : 'Open menu'}
          icon={on ? <IconX /> : <IconMenu2 />}
        />
        <NavbarBrand className="prose">
          <h2 className="text-zinc-900 dark:text-white">uSocial</h2>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          onClick={() => setSkin(skin === 'light' ? 'dark' : 'light')}
          color="primary"
          variant="flat"
          className="xs:!hidden sm:!flex"
          isIconOnly
        >
          {skin === 'light' ? <IconMoonFilled /> : <IconSunFilled />}
        </Button>
        <UserDropdown triggerClassName="sm:!flex xs:!hidden" />
      </NavbarContent>
      <NavbarMenu>
        <div className="flex w-full items-center justify-between gap-4">
          <UserDropdown triggerClassName="sm:!hidden xs:!block" />
          <Button
            onClick={() => setSkin(skin === 'light' ? 'dark' : 'light')}
            color="primary"
            variant="flat"
            className="xs:!flex sm:!hidden"
            isIconOnly
          >
            {skin === 'light' ? <IconMoonFilled /> : <IconSunFilled />}
          </Button>
        </div>
        <SidebarContent onSelectionChange={() => toggle(false)} />
      </NavbarMenu>
    </Navbar>
  );
}
