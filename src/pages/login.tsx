import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as React from "react";
import { useMutation } from "urql";
import { useLoginMutation } from "../../types-and-hooks";
import InputField from "../components/inputField";
import Wrapper from "../components/Wrapper";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (val, { setErrors }) => {
          const res = await login({ variables: { options: val } });
          if (res.data?.login?.errors) {
            setErrors(toErrorMap(res.data.login.errors));
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name={"username"}
              label={"Username"}
              placeholder="username"
            />
            <Box mt={8}>
              <InputField
                name={"password"}
                label={"Password"}
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
