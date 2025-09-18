// src/components/HeaderBar.jsx
import React from "react";
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderNavigation,
  HeaderMenuItem,
} from "@carbon/react";
import { Moon, Sun } from "@carbon/icons-react";
import { Link, useLocation } from "react-router-dom";

function HeaderBar({ theme, toggleTheme }) {
  const isDark = theme === "g90";
  const base = import.meta.env.BASE_URL || "/";
  const { pathname } = useLocation();

  return (
    <Header aria-label="Graham Newman RCA PhD carbon + GraphQL + Cooper Hewitt sandbox">
      <HeaderName href={base} prefix="">
        Graham Newman RCA PhD carbon + GraphQL + Cooper Hewitt sandbox
      </HeaderName>

      <HeaderNavigation aria-label="Primary">
        <HeaderMenuItem
          as={Link}
          to="/"
          isActive={pathname === "/"}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Sandbox
        </HeaderMenuItem>
        <HeaderMenuItem
          as={Link}
          to="/api"
          isActive={pathname.startsWith("/api")}
          aria-current={pathname.startsWith("/api") ? "page" : undefined}
        >
          The API
        </HeaderMenuItem>
      </HeaderNavigation>

      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={toggleTheme}
          tooltipAlignment="end"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
}

export default HeaderBar;