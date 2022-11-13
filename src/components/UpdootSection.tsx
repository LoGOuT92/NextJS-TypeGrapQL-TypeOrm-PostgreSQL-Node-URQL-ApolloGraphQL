import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import * as React from "react";
import { PostsQuery, useVoteMutation } from "../../types-and-hooks";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IUpdootSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}

const UpdootSection: React.FunctionComponent<IUpdootSectionProps> = ({
  post,
}) => {
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" justify="center" align="center" mr={4}>
      <IconButton
        icon={<ArrowUpIcon />}
        w={6}
        h={6}
        aria-label={"updoot post"}
        onClick={() =>
          vote({ variables: { postId: post.id, value: 1, userId: 2 } })
        }
      />
      {post.points}
      <IconButton
        icon={<ArrowDownIcon />}
        w={6}
        h={6}
        aria-label={"downdoot post"}
        onClick={() =>
          vote({ variables: { postId: post.id, value: -1, userId: 2 } })
        }
      />
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(UpdootSection);
