// @ts-ignore
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import { ChainName } from 'eosio-uri'
import { Abi } from 'eosjs/dist/eosjs-rpc-interfaces'
// import {state} from "../state/global"

const transport = new AnchorLinkBrowserTransport({
  fuelReferrer: 'boidservices',
  requestStatus: true
})
const link = new AnchorLink({
  verifyProofs: true,
  transport,
  chains: [
    // {
    //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    //   nodeUrl: 'https://eos.api.animus.is',
    // }
    {
      chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
      nodeUrl: 'https://jungle3.greymass.com',
    }
  ],
})

export { link }
