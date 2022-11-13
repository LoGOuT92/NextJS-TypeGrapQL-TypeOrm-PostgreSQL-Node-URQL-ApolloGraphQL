import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useDeletePostMutation, usePostsQuery } from "../../types-and-hooks";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [posts, setPosts] = useState([] as any);
  const { data, loading } = usePostsQuery({
    variables,
  });
  const [deletePost] = useDeletePostMutation();
  useEffect(() => {
    if (!loading && data!.posts.posts) {
      let x = data!.posts.posts;
      setPosts(posts.concat(x));
    }
    console.log("zmiana");
  }, [data]);

  const deletePostHandler = (id: number) => {
    const newPosts = posts.filter((p: { id: number }) => p.id !== id);
    setPosts(newPosts);
  };

  return (
    <Layout>
      <Flex align="center">
        <Heading>TEST</Heading>
        <Box ml="auto">
          <NextLink href="/create-post">Create Post</NextLink>
        </Box>
      </Flex>
      <br />
      <div> hello</div>
      <br />
      <Stack spacing={8} direction="column">
        {!posts && loading ? (
          <Box>Loading...</Box>
        ) : (
          posts.map((p: any) => (
            <Flex
              key={p.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              direction="row"
              flex={1}
              align="center"
            >
              <UpdootSection post={p} pageProps={p} />
              <Box>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Heading fontSize="xl">{p.title}</Heading>
                </NextLink>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
              <Box ml={"auto"}>
                <IconButton
                  aria-label="Delete post"
                  color="red"
                  onClick={() => (
                    deletePost({
                      variables: { userId: 2, deletePostId: p.id },
                    }),
                    deletePostHandler(p.id)
                  )}
                  icon={<DeleteIcon />}
                />
                <NextLink href="/post/edit/[id]" as={`/post/edit/${p.id}`}>
                  <IconButton
                    as={Link}
                    aria-label="Edit post"
                    color="blue"
                    icon={<EditIcon />}
                  />
                </NextLink>
              </Box>
            </Flex>
          ))
        )}
      </Stack>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data.posts.posts[data.posts.posts.length - 1].id.toString(),
              });
            }}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
