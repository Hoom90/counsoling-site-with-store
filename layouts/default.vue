<script setup>
const app = appStore()
const breadCrumbs = publicbreadcrumbstore()
</script>

<template>
      <BaseLoading v-if="app.getLoading"/>
      <LayoutThemeHeader/>
      <v-main>
            <v-container grid-list-xs class="pb-0">
                  <v-breadcrumbs v-if="breadCrumbs.getBreadCrumbs.length != 0" :items="breadCrumbs.getBreadCrumbs"
                        class="pt-1 pb-0">
                        <template v-slot:divider>
                              <v-icon icon="mdi-chevron-left"></v-icon>
                        </template>
                  </v-breadcrumbs>
            </v-container>
            <slot />
      </v-main>
      <LayoutThemeFooter />
</template>
