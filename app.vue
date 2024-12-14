<script setup>
import { userStore } from "@/stores/userStore"
import '@/assets/css/theme.css'
import '@/assets/css/admin.css'
import '@/assets/css/style.css'

onMounted(()=>{
  const user = userStore()
  if(!window.localStorage.getItem('theme')) window.localStorage.setItem('theme','LightTheme')
  user.setTheme(window.localStorage.getItem('theme'))
  user.setAuth(localStorage.getToken())
  user.setUser(localStorage.getUser())
  if(user.getFavorite.expertId && user.getUser){
      let id = user.getFavorite.expertId
      user.setFavorite(null)
      router.push(`expert/${id}`)
   }
})

useHead({
  titleTemplate: (page) => {
    return page
      ? `مرکز مشاوره سحاب - ${page}`
      : 'مرکز مشاوره سحاب'
  },
  htmlAttrs:{
    lang: 'fa',
    dir: 'rtl'
  }
})

</script>
<template>
  <v-app>
    <v-locale-provider rtl>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-locale-provider>
  </v-app>
</template>

