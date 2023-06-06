// rolling hash:
function rollingHash(incoming: number, outgoing: number, hash: number) {
  const temp = (hash - (outgoing & 0xff)) / 31;
  return temp * 31 + (incoming & 0xff);
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; ++i) {
    h = 31 * h + (s.charCodeAt(i) & 0xff);
  }
  return h;
}
