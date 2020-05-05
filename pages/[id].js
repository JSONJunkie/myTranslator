import { useRouter } from "next/router";

import validator from "validator";

import connectToMongo from "../database";

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
    paths: [],
    fallback: true
  };
}

export async function getStaticProps(context) {
  // if (validator.isEmpty(context.params.id)) {
  //   console.log("empty params/query");
  //   throw new Error("No query");
  // }
  const { connection, models } = await connectToMongo();
  const { Translations } = models;

  const docs = await Translations.find({ preTrans: context.params.id });
  console.log(docs);
  if (docs.length === 0) {
    console.log("no docs");
    const translation = context.params.id;
    const entry = new Translations({
      preTrans: translation,
      postTrans: translation,
      date: new Date()
    });
    await entry.save();
    connection.close();
    return { props: {} };
  }
  console.log("docs found");

  connection.close();
  return { props: { result: docs[0].postTrans } };
}

export default Post;
