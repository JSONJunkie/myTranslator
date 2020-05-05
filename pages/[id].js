import { useRouter } from "next/router";
import translations from "../translations.json";

const Post = ({ result }) => {
  const router = useRouter();
  // console.log(router);
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
  // await new Promise(resolve => setTimeout(resolve, 5000));
  // console.log(context);
  // console.log(translations.ex);
  const result = translations.ex.filter(
    entry => entry.en === context.params.id
  );
  console.log(result);
  // console.log(result[0].en);
  // if (result === "hello" || result === "teet") {
  //   return { props: { result } };
  // }
  // if (result) {
  //   return { props: { result: result[0].en } };
  // }

  translations.ex.push({ en: context.params.id });
  console.log(translations.ex);

  return { props: {} };
}

export default Post;
