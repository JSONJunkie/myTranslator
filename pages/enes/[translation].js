import { useRouter } from "next/router";

const Enes = () => {
  const router = useRouter();
  const { translation } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <p>{translation}</p>;
};

export async function getStaticProps(context) {
  console.log(context);
  console.log(context.params);

  return {
    props: {}
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { translation: "hello" } }],
    fallback: true
  };
}

export default Enes;
