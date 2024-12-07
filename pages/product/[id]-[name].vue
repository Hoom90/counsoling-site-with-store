<script setup>
const url = import.meta.env.VITE_STORE_URL
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import { EffectCreative, Pagination } from 'swiper/modules';
const route = useRoute();
const state = reactive({
  data: null,
  products: null,
  isLike: false,
  content: [],
  details: [
    { key: 'برند', value: 'سیل باستیل' },
    { key: 'وزن', value: '50' },
    { key: 'گنجایش', value: '220' },
    { key: 'رده سنی', value: '0-12' },
    { key: 'ابعاد', value: '5*17' },
    { key: 'نوع محصول', value: 'شیشه شیر' },
    { key: 'شامل', value: 'درپوش' },
    { key: 'جنس', value: 'پلاستیک' },
    { key: 'جنس سری', value: 'سیلیکون' },
    { key: 'قابلیت‌های سرمایشی و گرمایشی', value: 'قابلیت استفاده در ماکروویو' },
    { key: 'قابلیت شست‌وشو', value: 'توسط دست , توسط ماشین ظرف‌شویی' }
  ],
})

await fetchApi.get(apiPath.public.Product.getById(route.params.id), {})
  .then((res) => {
    state.data = res.data.value.data
    state.data.image = state.data.imageList?.find(x=>x.isDefault).id
    publicbreadcrumbstore().setBreadCrumbs([
      {
        title: 'خانه',
        disabled: false,
        to: '/',
      },
      {
        title: 'محصولات',
        disabled: false,
        to: '/product',
      },
      {
        title: state.data?.title,
        disabled: true,
        to: `/product/${state.data?.id}-${state.data?.title.replaceAll(' ','-')}`,
      }])
  }).catch(async (error) => {
    await navigateTo('/product')
    common.showError(error?.messages)
  })

await fetchApi.post(apiPath.public.Product.getAll, {body:{}})
  .then((res) => {
    state.products = res.data.value.data.map(x=>{
      x.link = `/product/${x.id}-${x.title.replaceAll(' ','-')}`
      return x
    })
    state.products = state.products.filter(x=>x.id != route.params.id)
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })

useHead({
  title: `${state.data?.title}`,
  meta: [{ name: 'description', content: `${state.data?.description}` }],
  meta: [{ name: 'keywords', content: `${state.data?.title}` }]
})
//#endregion

//#region LIKE
const putLike = async (id) => {
  state.content = JSON.parse(localStorage.getItem("content")) ?? []

  if (!state.content.includes(id))
    await axiosApi().put(apiPath.public.Content.put.like(id))
      .then((res) => {
        if (res) {
          state.data.like = res.data
          state.content.push(id)
          localStorage.setItem("content", JSON.stringify(state.content))
        }
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
}
//#endregion

//#region DISLIKE
const putDislike = async (id) => {
  state.content = JSON.parse(localStorage.getItem("content")) ?? []

  if (!state.content.includes(id))
    await axiosApi().put(apiPath.public.Content.put.dislike(id))
      .then((res) => {
        if (res) {
          state.data.disLike = res.data
          state.content.push(id)
          localStorage.setItem("content", JSON.stringify(state.content))
        }
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
}
//#endregion
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" :md="8" lg="9">
        <v-card class="single-content rounded-xl mb-5">
          <v-card-text class="d-sm-flex ga-5">
            <v-card flat class="w-100">
              <BaseImage :src="state.data?.image" :alt="state.data?.title" class="pa-0 rounded mx-auto mx-sm-0 w-100 cursor-pointer" @click="state.gallery = true"/>
            </v-card>
            <v-card flat class="w-100">
              <p class="w-100" style="line-height: 20px;">
                <span><small>{{ state.data?.category.title }}</small></span>
                <br>
                <span class="text-22">{{ state.data?.title }}</span>
                <br>
                <span><small>فروشگاه سحاب</small></span>
              </p>
              <p>
                <template v-if="state.data?.score == 0">
                  <v-icon size="20">mdi-star</v-icon>
                  <span class="ml-1">بدون امتیاز</span>
                </template>
                <template v-else>
                  <v-icon size="20" v-for="item in state.data?.score">mdi-star</v-icon>
                  <span class="ml-1">{{state.data?.score}}</span>
                </template>
              </p>
              <p>
                <span class="text-22">
                  <strong>{{ state.data?.price.toLocaleString() }}</strong>
                </span>
                <span class="text-9">
                  تومان
                </span>
              </p>
              <p>
                <span>تعداد موجود انبار: 
                  <v-chip :color="state.data?.count < 2 ? 'red' : ''">
                    {{ state.data?.count}}
                  </v-chip>عدد
                </span>
              </p>
              <p class="d-flex">
                <span v-html="state.data?.description"></span>
              </p>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card class="d-md-none rounded-xl bg-blue mb-5">
          <v-card-text class="pa-1 px-5 d-flex justify-space-between align-center">
            <v-card flat variant="text" height="50" class="d-flex align-center">
              <p class="text-20"><strong>{{ state.data?.price.toLocaleString() }}</strong>
                <small>تومان</small>
              </p>
            </v-card>
            <v-card flat variant="text">
              <v-chip>خرید از طریق درگاه</v-chip>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card class="d-md-none border rounded-xl mb-5">
          <v-card-text>
            <p><strong>مشخصات محصول</strong></p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card>
            <v-table>
              <tbody>
                <tr v-for="(tag, index) in state.data?.tagList" :key="index">
                  <th><strong>{{ tag.title }}</strong></th>
                  <td>{{ tag.value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-card>

        <LazyProductCommentComp :isAutoPublishActive="state.data?.isAutoPublishActive"/>
      </v-col>

      <v-col cols="12" md="4" lg="3">
        <v-card class="d-none d-md-block rounded-xl bg-blue mb-5" hover>
          <v-card-text class="pa-1 px-5 d-flex justify-space-between align-center">
            <v-card flat variant="text" height="50" class="d-flex align-center">
              <p class="text-20"><strong>{{ state.data?.price.toLocaleString() }}</strong>
                <small>تومان</small>
              </p>
            </v-card>
            <v-card flat variant="text">
              <v-chip>خرید از طریق درگاه</v-chip>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card class="d-none d-md-block border rounded-xl">
          <v-card-text>
            <p><strong>مشخصات محصول</strong></p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card flat class="overflow-auto" maxHeight="465">
            <v-table>
              <tbody>
                <tr v-for="(tag, index) in state.data?.tagList" :key="index" class="text-wrap">
                  <th class="height-40"><strong>{{ tag.title }}</strong></th>
                  <td class="height-40">{{ tag.value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
          <v-divider class="mb-3"></v-divider>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="state.products && state.products.length > 0">
      <v-col>
        <h5 class="ma-3 text-center">محصولات مشابه</h5>
        <swiper :grabCursor="true" :slidesPerView="2" :spaceBetween="15" :pagination="{
          clickable: true,
        }" :breakpoints="{
          '500': {slidesPerView: 3},
          '880': {slidesPerView: 4},
          '1200': {slidesPerView: 5},
        }" :modules="state.modules" class="mySwiper">
          <swiper-slide v-for="(item, index) in state.products" :key="index">
            <v-card flat class="rounded pa-1 border" :to="item.link">
              <v-card-text class="pa-1">
                <BaseImage :src="item.image" width="100%" class="rounded" />
                <v-card-title>
                  <strong class="text-14">{{ item.title }}</strong>
                </v-card-title>
                <v-card-subtitle class="text-center">{{ item.price.toLocaleString() }} تومان</v-card-subtitle>
              </v-card-text>
            </v-card>
          </swiper-slide>
        </swiper>
      </v-col>
    </v-row>
  </v-container>
  
  <BaseGalleryView :is-active="state.gallery" @is-not-active="state.gallery = false" :image-list="state.data?.imageList"/>
</template>