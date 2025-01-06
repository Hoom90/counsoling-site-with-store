<script setup>
const state = reactive({
  categories:[],
  payload: { pageSize: 10 }
})

fetchApi.get(apiPath.public.Category.post+common.jsonToQueryString(state.payload))
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
  display: grid !important;
  align-content: center !important;
  color: #4e4e4e !important;
  background: rgb(66 142 157 / 35%) !important;
  transition: all 0.2s linear !important;
  padding: 20px !important;
  border-radius: 10px !important;
  height: 100% !important;
}
.categoryCard:hover{
  transform: scale(1.1);
}
</style>
