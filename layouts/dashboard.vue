<script setup>
const breadCrumbs = dashboardbreadcrumbstore()
const state = reactive({
  showDrawer: true,
})

onMounted(() => {
  state.showDrawer = Boolean(localStorage.getItem('sidebar') ?? '1')
})

const changeDrawerState = () => {
  state.showDrawer = !state.showDrawer
  localStorage.setItem('sidebar', state.showDrawer ? '1' : '')
}

</script>
<template>
  <v-layout>
    <LayoutDashboardSidebar v-model="state.showDrawer" @update:modelValue="saveState" />
    <v-main>
      <LayoutDashboardHeader @change="changeDrawerState" />
        <section class="pa-5 overflow-y-auto">
        <v-breadcrumbs :items="breadCrumbs.getBreadCrumbs" class="pt-1 pb-5">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-left"></v-icon>
          </template>
        </v-breadcrumbs>
        <slot></slot>
      </section>
    </v-main>
  </v-layout>
</template>