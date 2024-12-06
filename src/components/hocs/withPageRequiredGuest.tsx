import React, { FunctionComponent, useEffect } from 'react';
import useAuth from '@hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';

type PropsType = {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

function withPageRequiredGuest(Component: FunctionComponent<PropsType>) {
  return function PageRequiredGuest(props: PropsType) {
    const { user, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const check = () => {
        if (!user || !isLoaded) return;

        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('returnTo') ?? `/`;
        navigate(returnTo, { replace: true });
      };

      check();
    }, [user, isLoaded, navigate]);

    return !user && isLoaded ? <Component {...props} /> : null;
  };
}

export default withPageRequiredGuest;
