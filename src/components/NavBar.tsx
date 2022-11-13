import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import * as React from "react";
import NextLink from "next/link";

interface INavBarProps {}

const NavBar: React.FunctionComponent<INavBarProps> = (props) => {
  return (
    <Box bg="tomato" p={4} ml={"auto"}>
      <Flex ml={"auto"} align="center">
        <NextLink href="/">
          <Heading mr={4}>Home </Heading>
        </NextLink>
        <NextLink href="/login">
          <Box mr={2}>Login</Box>
        </NextLink>
        <NextLink href="/register">
          <Box>Register</Box>
        </NextLink>
      </Flex>
    </Box>
  );
};

export default NavBar;
