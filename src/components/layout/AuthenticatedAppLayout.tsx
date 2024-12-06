import React, { useEffect } from 'react';
import withPageRequiredAuth from '@hocs/withPageRequiredAuth';
import Header from './Header';
import SidebarContent from './SidebarContent';
import { useNavigate, useHref, Outlet } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { UIKitSettingsBuilder } from '@cometchat/uikit-shared';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import useAuthTokens from '@hooks/auth/useAuthTokens';
import safeString from '@helpers/safeString';

const AuthenticatedAppLayout = (): React.ReactElement => {
  const navigate = useNavigate();
  const { tokensInfoRef } = useAuthTokens();
  const COMETCHAT_CONSTANTS = {
    APP_ID: '2678762915abcb85',
    REGION: 'eu',
    AUTH_KEY: '',
  };

  const UIKitSettings = new UIKitSettingsBuilder()
    .setAppId(COMETCHAT_CONSTANTS.APP_ID)
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
    .subscribePresenceForAllUsers()
    .build();

  useEffect(() => {
    CometChatUIKit.init(UIKitSettings)
      ?.then(() => {
        console.log('Initialization completed successfully');
        CometChatUIKit.getLoggedinUser()
          .then((user) => {
            if (!user) {
              CometChatUIKit.loginWithAuthToken(
                safeString(tokensInfoRef.current.chat_token)
              )
                .then((user) => {
                  console.log('Login Successful:', { user });
                })
                .catch(console.log);
            }
          })
          .catch(console.log);
      })
      .catch(console.log);
  }, []);

  return (
    <NextUIProvider
      className="relative flex min-h-[calc(%100-164px)] flex-col bg-background antialiased"
      navigate={navigate}
      useHref={useHref}
    >
      <Header />
      <main className="container relative z-10 mx-auto min-h-[calc(100vh_-_64px_-_108px)] !max-w-7xl flex-grow px-5 lg:!px-4">
        <div className="grid grid-cols-12">
          <div className="relative z-10 hidden overflow-visible border-e border-divider pe-4 lg:!col-span-2 lg:!block">
            <div className="z-0 lg:!fixed lg:!h-[calc(100vh-121px)]">
              <div className="relative">
                <div className="w-full pt-4">
                  <SidebarContent />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 min-h-[calc(%100-164px)] pt-5 lg:!col-span-10 lg:!ps-4 xl:!ps-16">
            <Outlet />
          </div>
        </div>
      </main>
    </NextUIProvider>
  );
};

export default withPageRequiredAuth(AuthenticatedAppLayout);
