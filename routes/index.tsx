import { Head } from "$fresh/runtime.ts";
import { hashtags } from "../utils/messages.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        {hashtags.map((hashtag) => (
          <>
            <a href={`/categories/${hashtag.slice(1)}`}>{hashtag}</a>
            <br />
          </>
        ))}
      </div>
    </>
  );
}
