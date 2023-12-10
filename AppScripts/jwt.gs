// MIT License
// Create a new appscript from the GSheet menu.
// Copy paste this script to a new appscript file.
// You can add more params to generateInvitationJWT accordingly depending on your need.
// Make sure you don't include too many data, otherwise the token will be too long.

const base64Encode = (text, json = true) => {
  const data = json ? JSON.stringify(text) : text;
  return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '');
};

const createJwt = ({ privateKey, data = {} }) => {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {};

  // add user payload
  Object.keys(data).forEach(function (key) {
    payload[key] = data[key];
  });

  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(toSign, privateKey);
  const signature = base64Encode(signatureBytes, false);
  return `${toSign}.${signature}`;
};

/**
 * Generate JWT token for the invitation URL
 * @customfunction
 */
const generateInvitationJWT = (privateKey, id, name) => {
  const data = {
    id: id,
    nm: name,
  }

  const accessToken = createJwt({
    privateKey,
    data: data,
  });

  return accessToken
};
