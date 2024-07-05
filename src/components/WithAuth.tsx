// src/components/withAuthentication.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { ScaleLoader } from 'react-spinners';

const withAuthentication = (Component: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
    const router = useRouter();

    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        loginWithRedirect({
          appState: { targetUrl: router.asPath },
        });
      }
    }, [isLoading, isAuthenticated, loginWithRedirect, router]);

    React.useEffect(() => {
      if (user) {
        console.log('Authenticated user:', user);
      }
    }, [user]);

    if (isLoading || !isAuthenticated) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <ScaleLoader color={"gray"} loading={isLoading} />
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withAuthentication;
