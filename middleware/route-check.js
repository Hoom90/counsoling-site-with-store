import { userStore } from "@/stores/userStore"
const user = userStore()

export default defineNuxtRouteMiddleware((to, from) => {
  // const aa=user.getAuth
  // const bb=user.getUser
  // debugger
  if (process.client) {

      user.setAuth(localStorage.getToken())
      user.setUser(localStorage.getUser())

      // const aa = user.getAuth
      // const dd = user.getIsAdmin
      // debugger
      if (to.meta.layout == "account" && !user.getAuth) {
        user.setLogOut()
        return navigateTo('/')
      }
      if (to.meta.layout == "dashboard" && !user.getIsAdmin)
        return navigateTo('/')

  }

  // return navigateTo('/')
  // return abortNavigation()
})