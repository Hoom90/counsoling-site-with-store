<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectFade, Autoplay, Keyboard, Pagination, Navigation } from 'swiper/modules';
const app = appStore()
const state = reactive({
  modules: [EffectFade, Autoplay, Keyboard, Pagination, Navigation],
  data: [],
})

fetchApi.get(apiPath.public.Slider.get.byParent(1))
  .then((res)=>{
    app.setloading(false)
    state.data = res.data.value.data
  })
  .catch((error)=>common.showError(error?.data?.messages))

</script>
<template>
  <v-container>
    <swiper 
      :slidesPerView="1" 
      :spaceBetween="30" 
      effect="fade" 
      :loop="true" 
      :centeredSlides="true" 
      :autoplay="{
        delay: 3500,
        disableOnInteraction: false,
      }"
      :keyboard="{
        enabled: true,
      }"
      :pagination="{
        clickable: true,
      }" 
      :navigation="true" 
      :modules="state.modules" 
      class="mainSlider"
      >
      <swiper-slide v-for="item in state.data">
        <BaseImage :src="item.imageId" :alt="item.title"/>
        <p class="slider-title" v-if="!item.link" >{{ item.title }}</p>
        <p class="slider-title" v-else><nuxt-link :to="item.link">{{ item.title }}</nuxt-link></p>
      </swiper-slide>
    </swiper>
    
  </v-container>
</template>

<style>
.swiper {
  width: 100%;
  height: auto;
  max-height: 450px;
  position: relative;
  z-index: 0;
}

.swiper img {
  object-fit: cover !important;
}
</style>
