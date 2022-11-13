import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { NextPage } from "next";
import router from "next/router";
import * as React from "react";
import InputField from "../../components/inputField";
import Wrapper from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import login from "../login";
import { useChangePasswordMutation } from "../../../types-and-hooks";

interface IChangePasswordProps {}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [changePassword] = useChangePasswordMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          newPassword: "",
          username: "",
          token: "9d3b0785-5757-417d-b8d8-fb7a066a42d4",
        }}
        onSubmit={async (val, { setErrors }) => {
          const res = await changePassword({
            variables: {
              newPassword: val.newPassword,
              username: val.username,
              token: token,
            },
          });
          //   if (res.data?.login?.errors) {
          //     setErrors(toErrorMap(res.data.login.errors));
          //   } else {
          //     router.push("/");
          //   }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={8}>
              <InputField
                name={"newPassword"}
                label={"Change Password"}
                placeholder="newPassword"
                type="password"
              />
            </Box>
            <Box mt={8}>
              <InputField
                name={"username"}
                label={"username"}
                placeholder="username"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
      {token}
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
