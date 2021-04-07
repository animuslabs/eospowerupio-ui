const { rpc } = require('./eosjs')(null,'https://api.eosn.io/')
const code = 'eospowerupio'
/** @type {any} */
const queries = {
  async getAccount(accountName){
    if (!accountName) return false
    const result = (await rpc.get_account(accountName))
    return result
  },
  async getDeposited(accountName) {
    if (!accountName) return "0.0000 EOS"
    const result = (await rpc.get_table_rows({ code, table: "account", scope: accountName, lower_bound: "EOS" })).rows[0].balance
    console.log(result);
    return result
  },
  async getBalance(accountName) {
    const result = (await rpc.get_currency_balance('eosio.token', accountName, 'EOS'))[0]
    console.log('User Balance:', result);
    return result
  },
  async getWatchlist(owner) {
    const result = (await rpc.get_table_rows({ code, table: 'watchlist', scope: owner,limit:-1 })).rows
    return result.map(el => {
      el.active = el.active == 1 ? true : false
      return el
    })
  }
}

export default queries