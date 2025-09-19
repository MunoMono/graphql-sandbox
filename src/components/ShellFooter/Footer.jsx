import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="cds--grid app-footer" role="contentinfo">
      <div className="cds--row">
        <div className="cds--col-sm-4 cds--col-md-8 cds--col-lg-16">
          <div className="app-footer__inner">
            <p className="cds--label-01">© {year} Innovation Design</p>
            <nav aria-label="Footer">
              <a className="cds--link" href="#/privacy">Privacy</a>
              <span aria-hidden="true" style={{ margin: '0 .5rem' }}>·</span>
              <a className="cds--link" href="#/terms">Terms</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}