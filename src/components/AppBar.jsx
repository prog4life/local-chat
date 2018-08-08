import React from 'react';
import pt from 'prop-types';
import { NavLink as RouterNavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';
import {
  Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse,
} from 'reactstrap';

import AppLogo from './AppLogo';

class AppBar extends React.Component {
  state = {
    isOpen: false,
  }

  handleToggling = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  handleSignOutClick = () => {
    const { signOut } = this.props;

    signOut();
  }

  render() {
    const { clientUid, isAnonymous } = this.props;
    const { isOpen } = this.state;

    return (
      // <Navbar color="faded / light / #fdecec" fixed="top">
      <Navbar className="app-bar" light expand="md">
        <NavbarBrand href="/">
          <AppLogo />
        </NavbarBrand>
        <NavbarToggler onClick={this.handleToggling} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" pills navbar>
            <NavItem>
              <NavLink
                to="/"
                exact
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Public Wall'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/chats"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Chats'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/profile"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Profile'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/settings"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Settings'}
              </NavLink>
            </NavItem>
            <NavItem>
              {clientUid && isAnonymous === false // omit isAnonymous null and true values
                ? (
                  <NavLink
                    href="#"
                    onClick={this.handleSignOutClick}
                  >
                    {'Sign Out'}
                  </NavLink>
                )
                : (
                  <NavLink
                    to="/login"
                    tag={RouterNavLink}
                    activeClassName="bg-white"
                  >
                    {'Login'}
                  </NavLink>
                )
              }
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

AppBar.propTypes = {
  clientUid: pt.string,
  isAnonymous: pt.bool,
  signOut: pt.func.isRequired,
};

AppBar.defaultProps = {
  clientUid: null,
  isAnonymous: null,
};

export default AppBar;
