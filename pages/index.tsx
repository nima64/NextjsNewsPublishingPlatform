import { getAllPosts } from '../lib/api';
import Nav from '../components/nav'
import Pills from '../components/pills';
import PostType from '../types/post';
import { GetServerSideProps } from 'next';
import { getUser } from '../lib/auth';
import User from '../types/user';
import Layout from '../components/layout';
import ArticlePreview from '../components/article_preview';

const Index = ({ allPosts, user }: { allPosts: PostType[], user: User }) => {
  return (
    <Layout user={user}>
      <div>
        <style jsx>{`
              .home-post:first-child{
                padding-top:0px;
              }
            `}</style>
        {
          allPosts.map((post, i) => (
            <ArticlePreview key={i} post={post}></ArticlePreview>
          ))
        }
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let user = await getUser(req, res) as User;
  let posts = await getAllPosts(user);
  return {
    props: {
      allPosts: posts,
      'user': user
    }
  }
}

export default Index
