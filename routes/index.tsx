import { hashtags } from "@/utils/messages.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("hashtag") || "";
    if (query === "") {
      return ctx.render();
    }
    return Response.redirect(`${url.origin}/categories/${query.slice(1)}`);
  },
};

export default function Home() {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-md">
        <form class="grid content-center">
          <select
            name="hashtag"
            class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
          >
            <option selected>Hashtag Seç</option>
            {hashtags.map((hashtag) => (
              <option value={hashtag}>{hashtag}</option>
            ))}
          </select>
          <button class="text-sm text-white py-3" type="submit">Seç</button>
        </form>
      </div>
    </>
  );
}
