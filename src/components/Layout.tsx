import * as React from "react";
import NavBar from "./NavBar";
import Wrapper from "./Wrapper";

interface ILayoutProps {
  variant?: "small" | "regular";
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({
  children,
  variant,
}) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
