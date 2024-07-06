import React, { useState } from 'react';
import {
  Navbar,
  Typography,
  List,
  ListItem,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from '@material-tailwind/react';
import { useAuth0 } from '@auth0/auth0-react';

function NavList() {
  return (
    <List className="flex flex-row p-0">
      <Typography
        as="a"
        href="/"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Home</ListItem>
      </Typography>
    </List>
  );
}

export default function LayoutHeader() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => setOpenMenu(!openMenu);

  if (isLoading) {
    return (
      <Navbar className="fixed top-0 left-0 right-6 bg-white shadow-md mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography as="a" href="/" variant="h6" className="mr-4 cursor-pointer">
            JOGS Logistica
          </Typography>
          <Button variant="text" disabled color="blue-gray">
            Authenticating
          </Button>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md mx-auto max-w-screen-xl px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography as="a" href="/" variant="h6" className="mr-4 cursor-pointer py-1.5 lg:ml-2">
          JOGS Logistica
        </Typography>
        <div className="hidden lg:block">
          {isAuthenticated && <NavList />}
        </div>
        {isAuthenticated && user ? (
          <div className="flex items-center">
            <Menu open={openMenu} handler={toggleMenu}>
              <MenuHandler>
                <Avatar
                  src={user.picture}
                  alt="User Avatar"
                  className="cursor-pointer"
                  onClick={toggleMenu}
                />
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        ) : (
          <Button variant="text" color="blue-gray" onClick={() => loginWithRedirect()}>
            Login
          </Button>
        )}
      </div>
    </Navbar>
  );
}
