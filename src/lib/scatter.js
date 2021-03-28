// @ts-nocheck

import ScatterJS from '@scatterjs/core';

import ScatterEOS from '@scatterjs/eosjs2';
import { JsonRpc, Api } from 'eosjs';




async function login() {

  try {
    ScatterJS.plugins(new ScatterEOS());
    const network = ScatterJS.Network.fromJson({
      blockchain: 'eos',
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      host: 'eos.greymass.com',
      port: 443,
      protocol: 'https'
    });
    const rpc = new JsonRpc(network.fullhost());
    const connection = await ScatterJS.connect('eospowerupio', { network })
    if (!connection) return console.error("No Scatter Connection")
    const eos = ScatterJS.eos(network, Api, { rpc })
    const id = await ScatterJS.login()
    if (!id) return console.error("Scatter: No Identity")
    const account = ScatterJS.account('eos');
    return { account, eos, ScatterJS }
  } catch (error) {
    console.error(error);
  }
}



export { login }