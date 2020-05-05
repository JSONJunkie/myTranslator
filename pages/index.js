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
      <div>
        <Link href={`/enes/${text}`} as={`/enes/${text}`}>
          <a>tem Translate</a>
        </Link>
      </div>
      <div>
        <Link prefetch={false} href="/enes/[translation]" as={`/enes/${text}`}>
          <a>brack Translate</a>
        </Link>
      </div>
    </div>
  );
};

export default Index;
