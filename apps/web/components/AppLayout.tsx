'use client';

import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
  User,
} from '@heroui/react';
import { RoutePath } from '@shared/route-path';
import { useUserContext } from '@web/app/user/UserContext';
import NextAdapterApp from 'next-query-params/app';
import { Suspense } from 'react';
import { QueryParamProvider } from 'use-query-params';
import { QuickUserSwitchModal } from './QuickUserSwitchModal';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser, logout } = useUserContext();

  const quickSwitchModalDisclosure = useDisclosure();

  return (
    <Suspense>
      <QueryParamProvider adapter={NextAdapterApp}>
        <Navbar>
          <NavbarBrand>
            <Link
              href={RoutePath.HOME}
              className="flex gap-2"
              color="foreground"
            >
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
              <p className="font-bold text-inherit">Podkastify</p>
            </Link>
          </NavbarBrand>

          <NavbarContent justify="end">
            {currentUser ? (
              <>
                <NavbarItem>
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <User
                        as="button"
                        avatarProps={{
                          isBordered: true,
                          src: currentUser.profilePicUrl ?? undefined,
                        }}
                        className="transition-transform"
                        name={currentUser.firstName}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                      <DropdownSection showDivider>
                        <DropdownItem
                          key="dashboard"
                          href={RoutePath.DASHBOARD}
                        >
                          Dashboard
                        </DropdownItem>
                        <DropdownItem
                          key="logout"
                          color="danger"
                          onPress={(e: any) => {
                            logout();
                            window.location.href = RoutePath.HOME;
                          }}
                        >
                          Log out
                        </DropdownItem>
                      </DropdownSection>

                      <DropdownSection title="Admin">
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          description="Switch to another user"
                          startContent={
                            <ArrowsRightLeftIcon className="h-6 w-6" />
                          }
                          onPress={quickSwitchModalDisclosure.onOpen}
                        >
                          Quick switch
                        </DropdownItem>
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>

                  <QuickUserSwitchModal
                    disclosure={quickSwitchModalDisclosure}
                  />
                </NavbarItem>
              </>
            ) : (
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  href={RoutePath.LOGIN}
                  variant="flat"
                >
                  Log in
                </Button>
              </NavbarItem>
            )}
          </NavbarContent>
        </Navbar>
        <div className="mx-auto max-w-5xl px-6">{children}</div>
        <footer></footer>
      </QueryParamProvider>
    </Suspense>
  );
}
