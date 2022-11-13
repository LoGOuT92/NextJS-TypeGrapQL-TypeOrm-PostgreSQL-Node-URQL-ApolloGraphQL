import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import Router from "next/router";
import gql from "graphql-tag";
import { VoteMutationVariables } from "../../types-and-hooks";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  
  return (_parent, fieldArgs, cache, info) => {
    console.log(info);
    
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";

  return {
    url: 'http://localhost:3000/graphql',
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates:{
          Mutation:{
            vote: (_result,args,cache,info)=>{
              console.log("aaaaaaaaaaaa");
              
              const {postId,value} = args as VoteMutationVariables;
              const data =cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                  }
                `,
                { id: postId } as any
              ); 
              console.log(data);
              
                  if(data){
                    const newPoints = data.points + value
                    cache.writeFragment(
                      gql`
                        fragment _ on Post {
                          points
                        }
                      `,
                      { id: postId, points: newPoints } as any
                    );
                  }
            },
            createPost:(_result,args,cache,info)=>{
              cache.invalidate("Query","posts",{
                limit: 10,
              });
            }
          }
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
