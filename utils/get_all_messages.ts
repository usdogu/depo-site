import { load } from "$std/dotenv/mod.ts";

import { TelegramClient } from "npm:telegram";
import { StringSession } from "npm:telegram/sessions/index.js";
import { EntityLike } from "npm:telegram/define.d.ts";

const env = await load();

const apiHash = env["API_HASH"];
const apiId = parseInt(env["API_ID"]);
const stringSession = new StringSession("");

interface Message {
  link: string;
  hashtags: string[];
}

async function getMessages(
  client: TelegramClient,
  channel: EntityLike,
): Promise<Message[]> {
  const messages: Message[] = [];
  for await (const message of client.iterMessages(channel, {})) {
    if (message.message !== undefined) {
      const parsedMessage = parseMessage(message.message);
      if (parsedMessage) {
        messages.push(parsedMessage);
      }
    }
  }
  return messages;
}

function parseMessage(rawMsg: string): Message | null {
  const urlRegex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
  const hashtagRegex = /#[a-z\u00C0-\u017F]+/ig;

  const link = rawMsg.match(urlRegex);
  if (!link) {
    return null;
  }

  const hashtags = rawMsg.match(hashtagRegex);

  return {
    link: link[0],
    hashtags: hashtags || [],
  };
}


(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    // deno-lint-ignore require-await
    phoneNumber: async () => prompt("Please enter your number: ")!,
    // deno-lint-ignore require-await
    password: async () => prompt("Please enter your password: ")!,
    // deno-lint-ignore require-await
    phoneCode: async () => prompt("Please enter the code you received: ")!,
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  const me = await client.getEntity("karisikdepo");
  const messages = await getMessages(client, me);
  // console.log(messages);
  await Deno.writeTextFile("messages.json", JSON.stringify(messages));
  console.log("Done");
})();
