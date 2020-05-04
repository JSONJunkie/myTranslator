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
      <Link href={`/enes/${text}`} as={`/enes/${text}`}>
        <a>Translate</a>
      </Link>
      {/* <Link href="/enes/[translation]" as={`/enes/${text}`}>
        <a>Translate</a>
      </Link> */}
    </div>
  );
};

export default Index;
