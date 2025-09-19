// src/components/HeaderBar.jsx
import React, { useEffect, useState } from "react";
import {
  Theme,
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenuButton,
  SideNav,
  SideNavItems,
  SideNavLink,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "@carbon/icons-react";

export default function HeaderBar({ theme, toggleTheme }) {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const isDark = theme === "g90";

  // Close the mobile sidenav on route change
  const location = useLocation();
  useEffect(() => {
    setIsSideNavExpanded(false);
  }, [location.pathname]);

  const navigate = useNavigate();

  return (
    <Theme theme="g100">
      <Header
        aria-label="GraphQL Sandbox"
        onOverlayClick={() => setIsSideNavExpanded(false)}
      >
        {/* Mobile hamburger */}
        <HeaderMenuButton
          aria-label="Open menu"
          isCollapsible
          isActive={isSideNavExpanded}
          onClick={() => setIsSideNavExpanded((v) => !v)}
        />

        {/* Brand */}
        <HeaderName as={Link} to="/" prefix="Graham Newman RCA PhD">
          GraphQL sandbox
        </HeaderName>

        {/* Desktop nav */}
        <HeaderNavigation aria-label="Main navigation">
          <HeaderMenuItem as={Link} to="/">Home</HeaderMenuItem>
          <HeaderMenuItem as={Link} to="/try">Try it out</HeaderMenuItem>
          <HeaderMenuItem as={Link} to="/snippets">Snippets</HeaderMenuItem>
        </HeaderNavigation>

        {/* Right-side actions (theme toggle) */}
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            tooltipAlignment="end"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </HeaderGlobalAction>
        </HeaderGlobalBar>

        {/* Mobile SideNav */}
        <SideNav
          aria-label="Mobile navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}
          onOverlayClick={() => setIsSideNavExpanded(false)}
        >
          <SideNavItems>
            <SideNavLink as={Link} to="/" onClick={() => navigate("/")}>
              Home
            </SideNavLink>
            <SideNavLink as={Link} to="/try" onClick={() => navigate("/try")}>
              Try it out
            </SideNavLink>
            <SideNavLink as={Link} to="/snippets" onClick={() => navigate("/snippets")}>
              Snippets
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </Header>
    </Theme>
  );
}