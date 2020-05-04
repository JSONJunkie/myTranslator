import { useRouter } from "next/router";

const Enes = () => {
  const router = useRouter();
  const { translation } = router.query;

  return <p>{translation}</p>;
};

export default Enes;
