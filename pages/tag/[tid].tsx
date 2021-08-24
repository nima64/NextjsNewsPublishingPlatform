import React from "react";
import PostType from "../../types/post";
import User from "../../types/user";
import Layout from "../../components/layout";
import ArticlePreview from "../../components/article_preview"; import Pills from "../../components/pills";
import { getUser } from "../../lib/auth";
import { getPostsByTag } from "../../lib/api";

export default function Tag ({ posts, user, tagID }: { posts: PostType[], user: User, tagID: string }) {
  return (
    <Layout user={user}>
      <h3 className="italic text-gray-500">#{tagID}</h3>
      <div>
        <style jsx global>{`
              .home-post:first-child{
                padding-top: 1.4rem;
              }
            `}</style>
        {
          posts.slice(0, 10).map((post, i) => (
            <ArticlePreview key={i} post={post}></ArticlePreview>
          ))
        }
      </div>
    </Layout>
  )
}

export const getServerSideProps = async ({ params, req, res }: any) => {
  let tid: string = params.tid;
  let user = await getUser(req, res);
  let posts = await getPostsByTag(tid);
  return {
    props: {
      'posts': posts,
      tagID: tid,
      'user': user
    }
  }

};