import { Filter } from "bad-words";

const filter = new Filter();
filter.addWords("fuck", "shit", "bitch", "asshole");

const text = "Man fuck you";
const cleaned = filter.clean(text);

console.log("Original:", text);
console.log("Cleaned:", cleaned);
