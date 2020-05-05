import { useState } from "react";

import Link from "next/link";

const Index = () => {
  const [text, setText] = useState("");

  const onChange = e => {
    setText(e.target.value);
  };

  return (
    <div>
      <input
        name="text"
        placeholder="Enter text to be translated here..."
        onChange={e => onChange(e)}
      />
      {/* <div>
        <Link prefetch={false} href={`/enes/${text}`} as={`/enes/${text}`}>
          <a>tem Translate</a>
        </Link>
      </div> */}
      <div>
        <Link prefetch={false} href="/enes/[translation]" as={`/enes/${text}`}>
          <a>input</a>
        </Link>
      </div>
      <div>
        <Link prefetch={false} href="/enes/test">
          <a>test</a>
        </Link>
      </div>
      <div>
        <Link prefetch={false} href="/enes/hello">
          <a>hello</a>
        </Link>
      </div>
      <div>
        <Link prefetch={false} href="/enes/loot">
          <a>loot</a>
        </Link>
      </div>
      <div>
        <Link prefetch={false} href="/enes/goobye">
          <a>goodbye</a>
        </Link>
      </div>
    </div>
  );
};

export default Index;
