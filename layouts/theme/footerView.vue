<script setup>
import enemad from "@/assets/enamad.png";
</script>
<template>
  <v-footer class="d-flex flex-column pa-0">
    <section class="d-none d-md-flex align-center pa-3">
      <v-btn to="/" variant="text" class="mx-2" rounded="xl">
        <p><strong>صفحه اصلی</strong></p>
      </v-btn>
      <v-btn to="/page/53/درباره-ما" variant="text" class="mx-2" rounded="xl">
        <p><strong>درباره ما</strong></p>
      </v-btn>
      <img :src="enemad" width="80" />
      <v-btn to="/page/99/تماس-با-ما" variant="text" class="mx-2" rounded="xl">
        <p><strong>تماس با ما</strong></p>
      </v-btn>
      <v-btn to="/page/168/شرایط-و-قوانین" variant="text" class="mx-2" rounded="xl">
        <p><strong>شرایط و قوانین</strong></p>
      </v-btn>
    </section>
    <div class="px-4 py-2 text-center w-100 text-12">
      تمامی حقوق و مزایای این سایت متعلق به <a href="http://sahab-eng.ir" target="_blank" class="text-black">
        <strong>شرکت سحاب</strong>
      </a> می باشد.
    </div>
  </v-footer>
</template>

