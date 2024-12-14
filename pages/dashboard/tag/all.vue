<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
</script>

<template>
  <v-toolbar class="mb-5" elevation="1" color="white" rounded>
    <v-toolbar-title>
      برچسب ها
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <TagNewTagComp />
  </v-toolbar>
</template>
