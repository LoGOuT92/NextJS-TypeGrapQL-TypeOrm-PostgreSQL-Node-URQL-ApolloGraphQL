import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import * as React from "react";
import InputField from "../../../components/inputField";
import Layout from "../../../components/Layout";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import createPost from "../../create-post";
import router, { useRouter } from "next/router";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../../types-and-hooks";
import { title } from "process";

interface IEditPostProps {}

const EditPost: React.FunctionComponent<IEditPostProps> = (props) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, loading } = usePostQuery({ variables: { id: intId } });
  const [updatePost] = useUpdatePostMutation();
  console.log(data?.post);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data!.post!.title,
          text: data!.post!.text,
          updatePostId: intId,
        }}
        onSubmit={async (val) => {
          if (typeof title !== "undefined") {
            updatePost({ variables: { ...val } });
          }
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
            <Button
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
function userRouter() {
  throw new Error("Function not implemented.");
}
