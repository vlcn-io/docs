// https://oeis.org/A000043
// https://en.wikipedia.org/wiki/Mersenne_prime
// https://math.stackexchange.com/questions/10059/what-is-the-largest-prime-less-than-231
const n = Math.pow(2, 31) - 1;
const a = 256;

// hash'("bra") =  [ ( [ ( [ ( 98 × 256) %101  + 114] % 101 ) × 256 ] % 101) + 97 ] % 101 = 30
export function hash(s: string): number {
  let h = 0;
  let exp = s.length;
  for (let i = 0; i < s.length; ++i) {
    h = ((h * (exp > 0 ? a : 1)) % n) + s.charCodeAt(i);
    exp -= 1;
  }

  return h % n;
}

// Incoming is expected to be appended to the end of the buffer
// Outgoing is expected to be dropped from the start
export function roll(
  incoming: number,
  outgoing: number,
  windowLength: number,
  hash: number
) {
  // remove first term
  let exp = 1;
  for (let i = 0; i < windowLength - 1; ++i) {
    exp = (exp * a) % n;
  }
  hash = hash - ((outgoing * exp) % n);

  // shift all terms left
  hash = (hash * a) % n;

  // add the incoming term
  return (hash + incoming) % n;
}
