import React, { useEffect, useState } from 'react';
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  SkipToContent,
  Content,
} from '@carbon/react';

// tiny sun/moon glyphs (safe, no extra icon deps)
const Sun = () => <span role="img" aria-label="Light">☀️</span>;
const Moon = () => <span role="img" aria-label="Dark">🌙</span>;

const BREAKPOINT = 672; // Carbon 'sm' breakpoint

export default function Shell({ children }) {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < BREAKPOINT : true
  );
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('cds-theme') || 'g10';
    }
    return 'g10';
  });

  // Apply Carbon CSS theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('cds-theme-g10', 'cds-theme-g90', 'cds-theme-white', 'cds-theme-g100');
    root.classList.add(`cds-theme-${theme}`);
    localStorage.setItem('cds-theme', theme);
  }, [theme]);

  // Mobile detection (hide sidenav + hamburger on desktop)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'g10' ? 'g90' : 'g10'));

  return (
    <>
      <SkipToContent href="#main-content" />

      <Header aria-label="API sandbox">
        {/* Mobile-only hamburger */}
        {isMobile && (
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            isActive={isSideNavExpanded}
            onClick={() => setIsSideNavExpanded((s) => !s)}
          />
        )}

        {/* Product name only; no top nav links */}
        <HeaderName href="#/" prefix="Graham Newman RCA PhD">
          GraphQL sandbox
        </HeaderName>

        {/* Only one global action: theme toggle */}
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label={theme === 'g90' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
            tooltipAlignment="end"
          >
            {theme === 'g90' ? <Sun /> : <Moon />}
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      {/* Side nav is mobile-only; simple sheet using a plain div so we avoid Carbon SideNav bundle */}
      {isMobile && isSideNavExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          className="app-sidenav"
          onClick={() => setIsSideNavExpanded(false)}
        >
          <nav className="app-sidenav__panel" onClick={(e) => e.stopPropagation()}>
            <h6 className="cds--heading-01" style={{ margin: '0 0 .5rem' }}>Menu</h6>
            {/* Single-page app now — keep items minimal or remove entirely */}
            <a className="cds--link" href="#/" onClick={() => setIsSideNavExpanded(false)}>Home</a>
          </nav>
        </div>
      )}

      {/* Main content wrapper */}
      <Content id="main-content" className="cds--grid" style={{ marginTop: '3rem' }}>
        <div className="cds--row">
          <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">{children}</div>
        </div>
      </Content>

      {/* Optional: you kept a footer component; if you want it visible, import and render here */}
      {/* <Footer /> */}
    </>
  );
}