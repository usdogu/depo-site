import { messages } from "@/utils/messages.ts";

const maketrans = (msg: string) => {   
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
 
messages.map((msg) => {
    msg.hashtags = msg.hashtags.map((hashtag) => maketrans(hashtag));
    return msg;
});

Deno.writeTextFileSync("data/messages.json", JSON.stringify(messages));