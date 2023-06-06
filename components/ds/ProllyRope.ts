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

// rolling hash:
export function rollingHash(incoming: number, outgoing: number, hash: number) {
  const temp = (hash - (outgoing & 0xff)) / 31;
  return 31 * temp + (incoming & 0xff);
}
