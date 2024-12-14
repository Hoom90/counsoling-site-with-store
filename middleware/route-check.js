import { userStore } from "@/stores/userStore"
const user = userStore()

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
      user.setAuth(localStorage.getToken())
      user.setUser(localStorage.getUser())
      if (to.meta.layout == "account" && !user.getAuth) {
        localStorage.logOut()
        return navigateTo('/')
      }
      if (to.meta.layout == "dashboard" && !user.getIsAdmin){
        localStorage.logOut()
        return navigateTo('/')
      }
  }
})