import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Button,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as React from "react";
import { useMutation } from "urql";
import { useRegisterMutation } from "../../types-and-hooks";
import InputField from "../components/inputField";
import Wrapper from "../components/Wrapper";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IRegisterProps {}

const REGISTER_MUT = `
mutation Register($username: String!,$password:String!){
    register(options: {username:$username,password:$password}) {
      username
      uuid
    }
  }`;

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (val, { setErrors }) => {
          const res = await register({ variables: { options: val } });
          if (res.data?.register.errors) {
            setErrors(toErrorMap(res.data.register.errors));
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
                name={"email"}
                label={"email"}
                placeholder="email"
                type="email"
              />
            </Box>
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
