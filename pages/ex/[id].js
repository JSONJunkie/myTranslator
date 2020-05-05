import { useRouter } from "next/router";

const Post = ({ result }) => {
  const router = useRouter();
  console.log(router);
  // console.log(result);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <p>{result}</p>;
};

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "test" } }],
    fallback: true
  };
}

export async function getStaticProps(context) {
  await new Promise(resolve => setTimeout(resolve, 5000));

  const result = context.params.id;
  return { props: { result } };
}

export default Post;
