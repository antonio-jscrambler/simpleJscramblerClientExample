var clone = require('lodash.clone');
var crypto = require('crypto');
var defaults = require('lodash.defaults');
var keys = require('lodash.keys');

const debug = !!process.env.DEBUG;


// sign params, add signature. Return the created payload
function signedParams(method, path, host, keys, params = {}) {
  params = defaults(clone(params), {
    access_key: keys.accessKey,
    timestamp: new Date().toISOString()
  });
  params.signature = generateHmacSignature(method, path, host, keys, params);
  return params;
}

// Create signature using method, path, host access key and query
function generateHmacSignature(method, path, host, keys, params) {
  const paramsCopy = clone(params);
  const signatureData = `${method.toUpperCase()};${host.toLowerCase()};${path};${buildSortedQuery(
    paramsCopy
  )}`;
  //console.log(`Signature data: ${signatureData}`);
  const hmac = crypto.createHmac('sha256', keys.secretKey.toUpperCase());
  hmac.update(signatureData);
  return hmac.digest('base64');
}

// Add query to the signature
function buildSortedQuery(params) {
  // Sorted keys
  const _keys = keys(params).sort();
  let query = '';
  for (let i = 0, l = _keys.length; i < l; i++) {
    query += `${encodeURIComponent(_keys[i])}=${encodeURIComponent(
      params[_keys[i]]
    )}&`;
  }
  query = query
    .replace(/\*/g, '%2A')
    .replace(/[!'()]/g, escape)
    .replace(/%7E/g, '~')
    .replace(/\+/g, '%20');
  // Strip the last separator and return
  return query.substring(0, query.length - 1);
}
module.exports = signedParams;