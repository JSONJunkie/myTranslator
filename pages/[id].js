import { useRouter } from "next/router";

import validator from "validator";

import connectToMongo from "../database";

const Post = ({ docs }) => {
  const router = useRouter();
  // console.log(router);
  // console.log(result);

  var data;

  if (docs) {
    data = JSON.parse(docs);
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <p>{data.postTrans}</p>;
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
    return { props: { docs: null } };
  }
  console.log("docs found");

  connection.close();
  return { props: { docs: JSON.stringify(docs[0]) } };
}

export default Post;
