export function shouldCommitInput(text) {
  return /[\s,;]$/.test(text);
}
