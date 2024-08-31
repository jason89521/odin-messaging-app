import { randomBytes } from 'node:crypto';

function main() {
  console.log(randomBytes(32).toString('hex'));
}

main();
