<script setup>
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
const state = reactive({
  data:[],
  components: {
    Swiper,
    SwiperSlide,
  },
})
const modules = [Navigation]

const data = await fetchApi.get(`${apiPath.public.Article.get.query}?ContentType=2`)
  .then((res) => res.data.value)
  .catch(error => common.showError(error?.data?.messages))
</script>
<template>
  <v-container>
    <v-card class="rounded-xl elevation-0" style="background: rgb(0 255 80 / 10%);backdrop-filter: blur(5px);">
      <v-card-title class="pt-md-9">
        <v-row>
          <v-col cols="6">
            <div class="STitle">
              <img src="@/assets/img/star-divider-line.png" width="40" />
              <h3>جدیدترین مقالات</h3>
              <!-- <img src="@/assets/img/divider-line01.png" width="300" /> -->
            </div>
          </v-col>
          <v-col cols="6">
            <div class="float-left">
              <NuxtLink to="/article">
                <v-btn color="primary" variant="tonal" class="rounded-xl px-5 px-md-10">
                  <p><strong>بیشتر</strong></p>
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-5 pb-9">
        <swiper
          :slidesPerView="2"
          :spaceBetween="18"
          :modules="modules"
          :navigation="true"
          :breakpoints="{
            '768': {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            '1024': {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            '1360': {
              slidesPerView: 6,
              spaceBetween: 30,
            },
        }" class="overflow-visible">



          <swiper-slide v-for="item in data" :key="item.id">
            <nuxtLink :to="`article/${item.id}/${item.title.replaceAll(' ','-')}`">
              <v-card class="d-flex flex-column justify-space-between rounded-xl" hover>
                <v-card-text class="pa-0">
                  <!-- <BaseImage :src="item.image" :is-thumbnail="true" :alt="item.title" style="aspect-ratio: 1;"/> -->
                  <BaseImage :src="item.image" :is-thumbnail="true" :alt="item.title"/>
                  <p class="height-42 text-wrap pa-3">
                    <strong>{{ item.title }}</strong>
                  </p>
                </v-card-text>
                <v-card-item class="pa-3">
                  <p>
                    <span class="ml-9">
                      <v-icon size="13" class="ml-2">mdi-calendar-month-outline</v-icon>
                      <small><strong>{{ dateConverter.someTimeAgo(item.createdOn) }}</strong></small>
                    </span>
                    <span>
                      <v-icon size="13" class="ml-2">mdi-eye-outline</v-icon>
                      <small><strong>{{ item.visitedCount ?? 0 }}</strong></small>
                    </span>
                  </p>
                </v-card-item>
              </v-card>
            </nuxtLink>
          </swiper-slide>



        </swiper>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
h4{
  text-wrap: pretty;
}
</style>

