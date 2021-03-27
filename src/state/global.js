
import { link } from '../lib/anchor'
import { LoginResult, LinkSession } from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import queries from '../lib/queries'

const state = {
  global: {
    data: "hello"
  },
  auth: {
    link: null,
    authMethod: null,
    /** @type {(LinkSession)} */
    anchor: null,
    userData: {
      actor: null,
      permission: null
    },
    loginOptions: {
      anchor: {
        title: "Anchor",
        async login(autoOnly) {
          try {
            /** @type {(LinkSession)} */
            let id = null
            id = await link.restoreSession('eospowerupio')
            // if(autoOnly) return
            if (!id) id = (await link.login('eospowerupio')).session
            state.auth.userData.actor = id.auth.actor.toString()
            state.auth.userData.permission = id.auth.permission.toString()
            state.auth.anchor = id
            state.auth.authMethod = 'anchor'
            window.localStorage.setItem('authMethod', 'anchor')
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
    login(autoOnly) {
      console.log(state.auth.authMethod);
      if (!state.auth.authMethod) return
      state.auth.loginOptions[state.auth.authMethod].login(autoOnly)
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
      this.userData = { actor: null, permission: null }
    },
    init() {
      const authMethod = window.localStorage.getItem('authMethod')
      if (authMethod == null || authMethod == undefined || authMethod == 'null') return
      state.auth.authMethod = authMethod
    }
  },
  queries
}

export { state }