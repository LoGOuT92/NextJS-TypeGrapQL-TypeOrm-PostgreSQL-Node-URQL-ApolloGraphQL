import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/router";
import * as React from "react";
import { useCreatePostMutation } from "../../types-and-hooks";
import InputField from "../components/inputField";
import Layout from "../components/Layout";
import Wrapper from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IcreatePostProps {}

const CreatePost: React.FunctionComponent<IcreatePostProps> = (props) => {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "", creatorId: "" }}
        onSubmit={async (val, { setErrors }) => {
          console.log(val);
          await createPost({
            variables: { input: val },
          });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name={"title"} label={"title"} placeholder="title" />
            <Box mt={8}>
              <InputField
                name={"text"}
                label={"text"}
                placeholder="text"
                textarea
              />
            </Box>
            <Box mt={8}>
              <InputField
                name={"creatorId"}
                label={"creatorId"}
                placeholder="creatorId"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient)(CreatePost);
