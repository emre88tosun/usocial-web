import React, { FunctionComponent, useEffect } from 'react';
import useAuth from '@hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';

type PropsType = {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
  children?: React.ReactNode;
};

function withPageRequiredAuth(Component: FunctionComponent<PropsType>) {
  return function WithPageRequiredAuth(props: PropsType) {
    const { user, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const check = () => {
        if (user || !isLoaded) return;

        const currentLocation = window.location.toString();
        const returnToPath =
          currentLocation.replace(new URL(currentLocation).origin, '') || `/`;
        const params = new URLSearchParams({
          returnTo: returnToPath,
        });

        let redirectTo = `/login?${params.toString()}`;

        if (user) {
          redirectTo = `/`;
        }

        navigate(redirectTo, { replace: true });
      };

      check();
    }, [user, isLoaded, navigate]);

    return user && isLoaded ? <Component {...props} /> : null;
  };
}

export default withPageRequiredAuth;
