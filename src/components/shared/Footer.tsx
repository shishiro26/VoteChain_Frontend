// import React from "react";

import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VoteChain. All rights{" "}
        <Link to={"/auth/login"}>reserved</Link>.
      </div>
    </footer>
  );
};

export default Footer;
