import * as React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p className="mb-0">&copy; {new Date().getFullYear()} Task Management — All rights reserved.</p>
    </footer>
  );
};

export default Footer;
