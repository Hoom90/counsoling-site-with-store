<script setup>
import mother from '@/assets/img/icons/mother.png'
import open_book from '@/assets/img/icons/open-book.png'
import girl from '@/assets/img/icons/girl.png'
import delivery_boy from '@/assets/img/icons/delivery-boy.png'
import sexual from '@/assets/img/icons/sexual.png'
import students from '@/assets/img/icons/students.png'
const state = reactive({
  images: [mother, open_book, girl, delivery_boy, sexual, students],
  categories:[],
  payload: { pageSize: 10 }
})

fetchApi.post(apiPath.public.Category.post, { body: state.payload })
  .then((res) => state.categories = res.data.value.data.slice(0,6))
  .catch(error => common.showError(error?.messages))
</script>
<template>
  <v-container>
    <v-card class="categories rounded-xl">
      <v-card-title class="pt-md-9">
        <v-row>
          <v-col cols="6">
            <div class="STitle">
              <img src="@/assets/img/star-divider-line.png" width="40" />
              <h3>کلینیک مجازی</h3>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-1 pt-md-5 pb-9">
        <v-row class="justify-center">
          <v-col cols="6" sm="4" md="2" v-for="(item, index) in state.categories" :key="index">
            <v-card variant="text" class="categoryCard" :to="`/category/${item.id}/${item.title.replaceAll(' ', '-')}`">
              <BaseImage :src="item.imageId" class="rounded-xl mb-3 w-50 mx-auto" />
              <p class="text-center">
                <strong>{{ item.title }}</strong>
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style>
.categoryCard{
  display: grid;
  align-content: center;
  color: #4e4e4e;
  background: rgb(66 142 157 / 35%);
  transition: all 0.2s linear;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
}
.categoryCard:hover{
  transform: scale(1.1);
}
</style>
