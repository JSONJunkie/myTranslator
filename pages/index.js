import { useState, Fragment } from "react";

import Link from "next/link";

const Index = () => {
  const [text, setText] = useState("");

  const onChange = e => {
    setText(e.target.value);
  };

  return (
    <div>
      <div>ssg rendered paths: "test"</div>
      <div>type "test" for path that doesnt need fallback</div>
      <div>type anything else for path that does need fallback</div>
      <input name="text" onChange={e => onChange(e)} />
      <div>
        <Link prefetch={false} href="/ex/[id]" as={"/ex/" + text}>
          <a>Correct (client side navigation, page doesnt refresh)</a>
        </Link>
      </div>
      <div>
        <Link prefetch={false} href={"/ex/" + text} as={"/ex/" + text}>
          <a>Incorrect(not clientside, page refreshes)</a>
        </Link>
      </div>
      <div>
        client side navigation from index to a non ssg route never shows the
        fallback. fallback only shows if navigation from index is done
        incorrectly (and page refreshes) or if the route is typed directly into
        the address bar as a url from anywhere (new/fresh page loads)
      </div>
    </div>
  );
};

export default Index;
