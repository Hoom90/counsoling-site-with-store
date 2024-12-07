<script setup>
import { userStore } from "@/stores/userStore"
import '@/assets/css/style.css'
onMounted(()=>{
  var user = userStore()
  user.setAuth(localStorage.getToken())
  user.setUser(localStorage.getUser())
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
  <v-app class="back-image">
    <v-locale-provider rtl>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-locale-provider>
  </v-app>
</template>

