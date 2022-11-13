import { Box } from "@chakra-ui/layout";
import * as React from "react";

interface IWrapperProps {
  children: React.ReactNode;
  variant?: "small" | "regular";
}

const Wrapper: React.FunctionComponent<IWrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
