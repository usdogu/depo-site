import { TelegramClient } from "npm:telegram";
import { StringSession } from "npm:telegram/sessions/index.js";
import { EntityLike } from "npm:telegram/define.d.ts";
import { Message, messages } from "@/utils/messages.ts";

const apiId = parseInt(Deno.env.get("API_ID")!);
const apiHash = Deno.env.get("API_HASH")!;
const stringSession = new StringSession(Deno.env.get("STRING_SESSION")!);

function translateToASCII(msg: string): string {   
  const trchars = ["Ş", "Ç", "Ğ", "İ", "Ü", "Ö", "ş", "ç", "ğ", "ı", "ü", "ö"];
  const enchars = ["S", "C", "G", "I", "U", "O", "s", "c", "g", "i", "u", "o"];
  const tmp = [];
  for (const char of msg) {
     if (trchars.indexOf(char) == -1) {
        tmp.push(char);
     } else {
        tmp.push(enchars[trchars.indexOf(char)]);
     }
  }
  return tmp.join("");
}


async function getMessages(
  client: TelegramClient,
  channel: EntityLike,
  offsetId: number,
): Promise<[Message[], number]> {
  const messages: Message[] = [];
  const ids: number[] = []

  for await (
    const message of client.iterMessages(channel, {
      offsetId: offsetId,
      reverse: true,
    })
  ) {
    if (message.message !== undefined) {
      const parsedMessage = parseMessage(message.message);
      if (parsedMessage) {
        messages.push(parsedMessage);
        ids.push(message.id);
      }
    }
  }
  return [messages, ids[ids.length - 1]];
}

function parseMessage(rawMsg: string): Message | null {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig;
  const hashtagRegex = /#[a-z\u00C0-\u017F]+/ig;

  const link = rawMsg.match(urlRegex);
  if (!link) {
    return null;
  }

  const hashtags = rawMsg.match(hashtagRegex);
  const hashtags_translated = (hashtags || []).map(translateToASCII);

  return {
    link: link[0],
    hashtags: hashtags_translated,
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

  const depo = await client.getEntity("karisikdepo");
  const last_id = parseInt(await Deno.readTextFile("data/last_id.txt"));
  const [new_messages, new_last_id] = await getMessages(client, depo, last_id);
  const messages_combined = [...new_messages, ...messages];
  await Deno.writeTextFile("data/messages.json", JSON.stringify(messages_combined));
  await Deno.writeTextFile("data/last_id.txt", new_last_id.toString(10));
  
  console.log("Done");
  Deno.exit();
})();
