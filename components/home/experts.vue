<script setup>
const app = appStore()
const state = reactive({
  data:[],
  payload: { pageSize: 10 },
})

 fetchApi.get(apiPath.public.Expert.get.paged+common.jsonToQueryString(state.payload))
  .then((res) => {
    state.data = res.data.value.data;
    app.setloading(false)
  }).catch(error => common.showError(error?.messages))

</script>
<template>
  <v-container>
    <v-card flat class="rounded-xl" style="background: #efffef;backdrop-filter: blur(5px);">
      <v-card-title class="pt-md-9">
        <v-row>
          <v-col cols="6">
            <div class="STitle">
              <img src="@/assets/img/star-divider-line.png" width="40" />
              <h3>متخصصان سایت</h3>
              <!-- <img src="@/assets/img/divider-line01.png" width="300" /> -->
            </div>
          </v-col>
          <v-col cols="6">
            <div class="float-left">
              <NuxtLink to="/news">
                <v-btn color="primary" variant="tonal" class="rounded-xl px-5 px-md-10">
                  <p><strong>بیشتر</strong></p>
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-5 pb-9 d-flex justify-center ga-5">
        <v-row class="justify-center">
          <v-col cols="6" md="3" v-for="(item,index) in state.data" :key="index">
            <v-card class="rounded-xl h-100 mx-auto" hover :to="`expert/${item.id}/${item.firstName.replaceAll(' ','-')}-${item.lastName.replaceAll(' ','-')}`">
              <v-row no-gutters class="flex-row-reverse">
                <v-col cols="12" sm="6">
                  <BaseImage v-if="item.imageId" :src="item.imageId" :is-thumbnail="true" 
                    class="indexExpertImage" :alt="item.title"/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card-text class="h-100 d-flex justify-space-between flex-column">
                    <p><strong>{{ item.firstName + ' ' + item.lastName }}</strong></p>
                    <v-card flat>
                      <p>
                        <v-icon size="20">mdi-star-outline</v-icon>
                        <small><strong>{{ item.score }}</strong></small>
                      </p>
                      <p>
                        <v-icon size="20">mdi-account-outline</v-icon>
                        <small><strong>{{ item.visitedCount }}</strong> ویزیت شده</small>
                      </p>
                    </v-card>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style>
.indexExpertImage{
  height: 200px;
}
</style>