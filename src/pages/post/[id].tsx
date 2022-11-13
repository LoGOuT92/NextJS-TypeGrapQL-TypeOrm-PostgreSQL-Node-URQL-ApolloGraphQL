import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import * as React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery, usePostsQuery } from "../../../types-and-hooks";
import Layout from "../../components/Layout";
import { Heading } from "@chakra-ui/react";

interface IPostProps {}

const Post: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const { data, loading, error } = usePostQuery({
    variables: {
      id: intId,
    },
  });
  const x = data;
  console.log();

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>could not fund post</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>{data?.post?.title}</Heading>
      {data?.post?.text}
    </Layout>
  );
};

Post.getInitialProps = ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
