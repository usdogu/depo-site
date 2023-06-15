export interface Message {
    link: string;
    hashtags: string[];
  }

export const messages = JSON.parse(Deno.readTextFileSync("data/messages.json")) as Message[];
export const hashtags = [...new Set(messages.flatMap((m) => m.hashtags))].sort();