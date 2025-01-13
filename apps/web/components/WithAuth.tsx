'use client';

import { RoutePath } from '@shared/route-path';
import { useUserContext } from '@web/app/user/UserContext';
import { useRouter } from 'next/navigation';
import React, { ComponentType, useEffect, useState } from 'react';

function WithAuth<P extends {}>(
  Component: ComponentType<P>,
  allowedRoles: string[],
  failedRedirectPath = RoutePath.LOGIN,
): React.FC<P> {
  const WithAuthComponent: React.FC<P> = (props) => {
    const { currentUser, isAuthenticating } = useUserContext();
    const router = useRouter();
    const [componentExplicitlyAuthorized, setComponentExplicitlyAuthorized] =
      useState(false);

    useEffect(() => {
      if (!isAuthenticating) {
        // If there's no user or the user's roles don't include the required roles, redirect them.
        const isAuthorized = currentUser?.roles?.some((role) =>
          allowedRoles.includes(role.name),
        );
        if (!currentUser || !isAuthorized) {
          router.push(failedRedirectPath);
          return;
        }

        setComponentExplicitlyAuthorized(true);
      }
    }, [currentUser, isAuthenticating, router, componentExplicitlyAuthorized]);

    // Render a loading state or null until authentication is determined.
    if (isAuthenticating || !currentUser) {
      return <></>;
    }

    if (!componentExplicitlyAuthorized) {
      return <>NOT AUTHORIZED!</>;
    }

    // Spread the props to the component when rendering.
    return <Component {...props} />;
  };

  return WithAuthComponent;
}

export default WithAuth;
