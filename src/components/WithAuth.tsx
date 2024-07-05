// src/components/withAuthentication.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';

const withAuthentication = (Component: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const router = useRouter();

    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        loginWithRedirect({
          appState: { targetUrl: router.asPath },
        });
      }
    }, [isLoading, isAuthenticated, loginWithRedirect, router]);

    if (isLoading || !isAuthenticated) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};

export default withAuthentication;
