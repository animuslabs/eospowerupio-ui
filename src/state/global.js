
import { link } from '../lib/anchor'
import { LoginResult, LinkSession } from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import queries from '../lib/queries'
import { Notify } from 'quasar'
import * as scatter from '../lib/scatter'
import Vue from 'vue'
const state = {
  global: {
    data: "hello"
  },
  auth: {
    link: null,
    authMethod: null,
    /** @type {(LinkSession)} */
    anchor: null,
    scatter: null,
    scatterJS: null,
    userData: {
      actor: null,
      permission: null
    },
    loginOptions: {
      scatter: {
        title: "Scatter",
        async login() {
          const scatterAuth = await scatter.login()
          if (!scatterAuth) return console.error('Scatter login problem')
          console.log('Scatter eos:', scatterAuth.eos);
          console.log('Scatter Account:', scatterAuth.account);
          state.auth.scatter = scatterAuth.eos
          state.auth.scatterJS = scatterAuth.ScatterJS
          Vue.set(state.auth,'userData',{actor:scatterAuth.account.name,permission:scatterAuth.account.authority})
          state.auth.saveAuthMethod('scatter')
        },
        async logout() {
          // @ts-ignore 
          await state.auth.scatterJS.logout()
          state.auth.resetUserData()
        },
        async doActions(actions) {
          try {
            const result = await state.auth.scatter.transact({ actions }, {
              blocksBehind: 3,
              expireSeconds: 30,
            })
            Notify.create({ message: "Transaction Succeeded", position: 'bottom', color: 'cyan-6', icon: 'check', progress: true, timeout: 2000 })
          } catch (error) {
            console.error(error)
            if(error) Notify.create({ message: error.message, position: 'bottom', color: 'red', icon: 'close', progress: true, timeout: 6000 })
          }

        }
      },
      anchor: {
        title: "Anchor",
        async login(autoOnly) {
          try {
            /** @type {(LinkSession)} */
            let id = null
            id = await link.restoreSession('eospowerupio')
            // if(autoOnly) return
            if (!id) id = (await link.login('eospowerupio')).session
            Vue.set(state.auth,'userData',{actor:id.auth.actor.toString(),permission:id.auth.permission.toString()})

            state.auth.anchor = id
            state.auth.saveAuthMethod('anchor')
          } catch (error) {
            console.error(error.toString())
          }

        },
        async logout() {
          await link.clearSessions('eospowerupio')
        }, async doActions(actions) {
          await state.auth.anchor.transact({ actions })
            .catch(err => {
              console.error(err)
            })
        }
      }
    },
    logout() {
      if (!state.auth.authMethod) return
      state.auth.loginOptions[state.auth.authMethod].logout()
      state.auth.resetUserData()
      window.localStorage.removeItem('authMethod')
      state.auth.authMethod = null
    },
    login() {
      console.log(state.auth.authMethod);
      if (!state.auth.authMethod) state.auth.loginOptions.scatter.login()
      else state.auth.loginOptions[state.auth.authMethod].login()
    },
    async doActions(actions) {
      actions = actions.map(el => {
        if (!el.authorization) el.authorization = [{ actor: state.auth.userData.actor, permission: state.auth.userData.permission }]
        return el
      })
      try {
        await state.auth.loginOptions[state.auth.authMethod].doActions(actions)
      } catch (error) {
        console.error(error.toString());
      }
    },
    resetUserData() {
      // this.userData = { actor: null, permission: null }
      Vue.set(state.auth,'userData',{actor:null,permission:null})
    },
    init() {
      const authMethod = window.localStorage.getItem('authMethod')
      if (authMethod == null || authMethod == undefined || authMethod == 'null') return
      state.auth.authMethod = authMethod
    },
    saveAuthMethod(method) {
      state.auth.authMethod = method
      window.localStorage.setItem('authMethod', method)
    }
  },
  queries
}

export { state }