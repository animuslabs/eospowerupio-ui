import queries from "../lib/queries";
class donations {
  constructor(contractAccount, api) {
    this.api = api;
    this.contractAccount = contractAccount;
    this.config = null; //cache config during lifespan of this object.
  }
  contractAccount = ''
  data
  leaderboard = []
  mintResults = []
  config
  async get_account_minted(accountName) {
    let res = await this.api.rpc.get_table_rows({
      json: true,
      code: this.contractAccount,
      scope: this.contractAccount,
      lower_bound: accountName,
      upper_bound: accountName,
      table: "claimed",
      limit: 1
    });
    if (res && res.rows.length) {

      return res.rows[0];
    }
    else {
      console.log(accountName, ' doesn\'t have a minted row');
      return {
        bronze_unclaimed: 0,
        bronze_claimed: 0,
        silver_claimed: 0,
        gold_claimed: 0
      };
    }
  }
  async get_account_nfts(accountName) {
    const allNFTs = await queries.getFullTable({
      code: "atomicassets",
      scope: accountName,
      table: "assets"
    });
    return allNFTs;
  }
  async get_nft_bal(accountName) {
    let res = await this.api.rpc.get_table_rows({
      json: true,
      code: this.contractAccount,
      scope: accountName,
      table: "balances",
      limit: 100
    });

    if (res && res.rows[0]) {
      console.log(res.rows);
      let balances = {};
      for (const row of res.rows) {
        balances[row.template_id] = row.balance;
      }
      console.log("nft balances:", balances);
      return balances;
    } else {
      return {};
    }
  }
  async get_data(reload = false) {
    let result = { calc: {} };
    const config = await this.get_config(reload);
    result.config = config;

    const now = Math.floor(Date.now() / 1000);//current time point in sec since epoch
    const first_round_start_sec = Date.parse(config.start_time.split(".")[0] + ".000+00:00") / 1000;//timestamp of when the first round will/is start(ed)
    const total_sec_elapsed = now - first_round_start_sec;
    const current_round_id = Math.floor(total_sec_elapsed / config.round_length_sec) + 1;

    const round_start_sec = first_round_start_sec + (config.round_length_sec * (current_round_id - 1));//start time of the current round
    const round_sec_elapsed = now - round_start_sec;// seconds that elapsed in current round

    result.calc.now = now;
    result.calc.first_round_start_sec = first_round_start_sec;
    result.calc.total_sec_elapsed = total_sec_elapsed;
    result.calc.current_round_id = current_round_id;
    result.calc.round_start_sec = round_start_sec;
    result.calc.round_sec_elapsed = round_sec_elapsed;
    this.data = result
    return result;
  }
  async convert_donation_to_score(donation) {
    //donation is asset "1.0000 EOS"
    const round_data = await this.get_data(false);
    let step = Math.floor(round_data.calc.round_sec_elapsed / round_data.config.decay_step_sec);
    if (step > round_data.config.start_decay_after_steps) {
      step -= round_data.config.start_decay_after_steps;
    }
    else {
      //no bonus decay so we stay at step 0
      step = 0;
    }
    //assuming donation asset with precission 4
    let pv = parseFloat(donation) * 10000;
    const bonus = pv * Math.pow((1 - round_data.config.compound_decay_pct), step);
    let score = pv + bonus;
    console.log(score);
    return score;
  }

  async get_config(reload = false) {
    if (this.config !== null && !reload) {
      return this.config;
    }
    console.log("retrieving config table");
    let res = await this.api.rpc.get_table_rows({
      json: true,
      code: this.contractAccount,
      scope: this.contractAccount,
      table: "config",
      limit: 1
    });

    if (res && res.rows[0]) {
      this.config = res.rows[0];
      return res.rows[0];
    } else {
      return false;
    }
  }

  async get_leaderboard(round_id) {
    if (!round_id) {
      if (!this.data) await this.get_data();
      round_id = this.data.calc.current_round_id;
    }
    console.log(`retrieving leaderboard with scope/id ${round_id}`);

    let res = await queries.getFullTable({
      json: true,
      code: this.contractAccount,
      key_type: "i64",
      index_position: 2,
      scope: String(round_id),
      table: "leaderboard"
    });

    console.log(res);

    if (res && res.length) {
      console.log(`leaderboard`, res);
      this.leaderboard = res;
      this.calculate_mint_results();
      return res;
    } else {
      return false;
    }
  }
  async calculate_mint_results() {
    if (!this.leaderboard) await this.get_leaderboard();
    if (!this.config) await this.get_config();
    const totalMint = this.config.nft.max_bronze_mint_per_round;
    let mintPrice = parseFloat(this.config.nft.mint_price_min);
    let minted = 0;
    let mintResults = [];
    for (let i = 0; i < this.leaderboard.length && minted != totalMint; i++) {
      const el = this.leaderboard[i];
      const donated = parseFloat(el.donated);
      if (donated < mintPrice) break;
      let remaining = totalMint - minted;
      let mintNum = donated / mintPrice;
      mintPrice += parseFloat(this.config.nft.mint_price_increase_by_rank);
      let toMint = Math.min(remaining, mintNum);
      mintResults.push(parseInt(toMint));
    }
    this.mintResults = mintResults;
  }
  async get_round(round_id) {
    console.log(`retrieving round with id ${round_id}`);
    let res = await this.api.rpc.get_table_rows({
      code: this.contractAccount,
      scope: this.contractAccount,
      lower_bound: round_id,
      upper_bound: round_id,
      table: "rounds",
      limit: 1
    });

    if (res && res.rows.length) {
      console.log(`round ${round_id}`, res.rows);
      console.log(`table data complete?`, !res.more);
      return res.rows[0];
    } else {
      console.log(
        `Round with id ${round_id} doesn't exists. Nobody donated in this round yet.`,
        res.rows
      );
      return false;
    }
  }

  async get_rounds() {
    console.log(`retrieving rounds table`);
    let res = await queries.getFullTable({
      code: this.contractAccount,
      scope: this.contractAccount,
      table: "rounds"
    });

    if (res && res.length) {
      console.log(`rounds`, res.rows);
      console.log(`table data complete?`, !res.more);
    } else {
      console.log(`rounds table is empty`, res);
    }
  }
}
export default donations;
