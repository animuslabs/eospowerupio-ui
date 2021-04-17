const { rpc } = require('./eosjs')(null, 'https://api.eosn.io/')
import ax from 'axios'
const code = 'eospowerupio'
import dfuse from '../lib/dfuse'


class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    emit(event, data){
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}


const queries = {
  hello:'fart',
  async getAccount(accountName) {
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
    const result = (await rpc.get_table_rows({ code, table: 'watchlist', scope: owner, limit: -1 })).rows
    return result.map(el => {
      el.active = el.active == 1 ? true : false
      return el
    })
  },
  async getStats() {
    const result = await ax.get('https://api.eospowerup.io/stats').catch(err => console.error(err.toString()))
    if(result) return result.data
    else return {
      owners:0,
      watchAccounts:0
    }
  },
  getRecentActions(){
    const vars = {
      "query": "receiver:'eospowerupio' (action:'logpowerup' OR action:'logbuyram')",
      "low":-500
    }

    const streamQuery = `subscription ($query: String!, $low: Int64) {
      searchTransactionsForward(query: $query, lowBlockNum: $low) {
          trace { id block{timestamp,num} matchingActions{ json }}
      }
    }`
    return {vars,streamQuery}
  }
}

export default queries

