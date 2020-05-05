import { useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";

const Index = () => {
  const [text, setText] = useState("");

  const onChange = e => {
    setText(e.target.value);
  };

  function ActiveLink({ children, href, as }) {
    const router = useRouter();
    const style = {
      marginRight: 10,
      color: router.pathname === href ? "red" : "black"
    };

    const handleClick = e => {
      e.preventDefault();
      router.push(href, as, { shallow: true });
    };

    return (
      <a href={href} as={as} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <div>
      <input name="text" onChange={e => onChange(e)} />
      <ActiveLink href={"/[id]"} as={"/" + text}>
        Hellllo
      </ActiveLink>
      {/* <div>
        <Link prefetch={false} href="/ex/[id]" as={"/ex/" + text}>
          <a>Correct (client side navigation, page doesnt refresh)</a>
        </Link>
      </div> */}
      {/* <div>
        <Link prefetch={false} href={"/ex/" + text} as={"/ex/" + text}>
          <a>Incorrect(not clientside, page refreshes)</a>
        </Link>
      </div> */}
    </div>
  );
};

export default Index;
