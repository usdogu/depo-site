import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { Message, messages } from "@/utils/messages.ts"

export const handler: Handlers = {
  GET(req, ctx) {
    const { category } = ctx.params;
    const msgsByCategory = messages.filter((msg) =>
      msg.hashtags.includes(`#${category}`)
    );
    if (msgsByCategory.length === 0) {
      return ctx.renderNotFound();
    }
    return ctx.render(msgsByCategory);
  },
};

export default function Category({ data }: PageProps<Message[]>) {
  return (
    <div class="relative overflow-x-auto shadow-md">
      <table class="table-auto border-collapse w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Link</th>
            <th scope="col" class="px-6 py-3">Hashtags</th>
          </tr>
        </thead>
        <tbody>
          {data.map((msg) => (
            <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                key={msg.link}
              >
                <a
                  class="text-gray-400 hover:text-white transition-colors ease-out duration-300"
                  href={msg.link}
                >
                  {msg.link}
                </a>
              </th>
              <td class="px-6 py-4" key={msg.hashtags}>
                {msg.hashtags.join(" ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
