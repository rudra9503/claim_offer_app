const crypto = require('crypto');

// No 0, O, 1, I so codes are easy to read out loud
const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Returns something like GOLO-7F82K9
const generateClaimCode = () => {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARACTERS[crypto.randomInt(CHARACTERS.length)];
  }
  return `GOLO-${code}`;
};

module.exports = generateClaimCode;