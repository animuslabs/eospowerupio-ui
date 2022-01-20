const { JsonRpc, Api } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
// const { TextDecoder, TextEncoder } = require('util')

const tapos = {
  blocksBehind: 6,
  expireSeconds: 10,
  broadcast: true
}

function init(keys, apiurl) {
  if (!keys) keys = []
  const signatureProvider = new JsSignatureProvider(keys)
  if (!apiurl) apiurl = 'https://eos.greymass.com'
  var rpc = new JsonRpc(apiurl, { fetch })
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

  return { api, rpc, tapos }
}

module.exports = init
