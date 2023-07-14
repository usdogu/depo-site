import { TelegramClient } from "grm/mod.ts";
import { StringSession } from "grm/sessions/mod.ts";
import { Api } from "grm/tl/api.d.ts";
import { Message } from "@/utils/messages.ts";
type EntityLike = Api.TypeEntityLike

const apiId = parseInt(Deno.env.get("API_ID")!);
const apiHash = Deno.env.get("API_HASH")!;
const stringSession = new StringSession(Deno.env.get("STRING_SESSION"));

function fixHashtags(msg: string): string {
  msg = msg.toLocaleLowerCase("tr-TR");
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
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig;
  const hashtagRegex = /#[a-z\u00C0-\u017F]+/ig;

  const link = rawMsg.match(urlRegex);
  if (!link) {
    return null;
  }

  const hashtags = rawMsg.match(hashtagRegex);
  const hashtags_translated = (hashtags || []).map(fixHashtags);
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
  console.log(client.session.save()); // Save this string to avoid logging in again

  const depo = await client.getEntity("karisikdepo");
  const messages = await getMessages(client, depo);
  await Deno.writeTextFile("data/messages.json", JSON.stringify(messages));

  console.log("Done");
  Deno.exit();
})();
