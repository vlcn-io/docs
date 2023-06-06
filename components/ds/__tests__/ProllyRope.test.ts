import { test, expect } from "vitest";

import { hash, roll } from "../ProllyRope";

// test("rolling hash", () => {
//   const str =
//     "this is some string that we are going to hash in a rolling way as well as chunked way. Both methods should agree!";

//   const window = 2;
//   let rollHash: number | null = null;
//   for (let i = window; i < str.length; ++i) {
//     const regHash = hash(str.substring(i - window, i));
//     if (rollHash == null) {
//       rollHash = regHash;
//     } else {
//       console.log("Incoming: ", str[i - 1]);
//       console.log("Outgoing: ", str[i - window - 1]);
//       console.log("Full str: ", str.substring(i - window - 1, i));
//       rollHash = rollingHash(
//         str.charCodeAt(i - 1),
//         str.charCodeAt(i - window - 1),
//         rollHash
//       );
//     }
//     console.log(rollHash, regHash);
//     expect(rollHash).toEqual(regHash);
//   }
// });

test("bra", () => {
  let h = hash("bra");
  console.log(h);

  h = roll("b".charCodeAt(0), "b".charCodeAt(0), 3, h);
  console.log(h);
  h = roll("r".charCodeAt(0), "r".charCodeAt(0), 3, h);
  console.log(h);
  h = roll("a".charCodeAt(0), "a".charCodeAt(0), 3, h);

  console.log(h);
});
