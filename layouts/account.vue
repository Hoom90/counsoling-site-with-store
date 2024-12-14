<script setup>
useHead({
  title: 'پنل کاربری'
})
</script>

<template>
  <LayoutAccountHeader />
  <v-main>
    <v-container>
      <v-row class="mb-5">
        <v-col cols="12" md="4" lg="3">
          <LayoutAccountSidebar />
        </v-col>
        <v-col cols="12" md="8" lg="9">
          <v-card class="rounded-xl" min-height="545">
            <v-card-text>
              <slot />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <LayoutAccountFooter />
</template>