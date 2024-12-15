<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const verifyForm = ref();
const route = useRoute()
const state = reactive({
  tags: [],
  formData: {
    title: null,
    description: null,
    count: '1',
    price: '1,000',
    isActive: true,
    specialSale: false,
    imageList: [],
    categoryId: null,
    tagList: [],
    keywords:[],
    isCommentActive:false,
    isAutoPublishActive:false,
  },
  loadEditor:false,
})

onMounted(() => {
  getFeatures()
  load()
  getAllCategory()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'محصولات',
      disabled: false,
      to: '/dashboard/product/list',
    }, {
      title: 'محصول جدید ',
      disabled: true,
      to: '/dashboard/product/add/',
    }])
})

const save = async () => {
  const { valid } = await verifyForm.value.validate()
  if (valid && state.formData.imageList.length != 0) {
    state.formData.price = parseInt(state.formData.price.replaceAll(',',''))
    state.formData.count = parseInt(state.formData.count.replaceAll(',',''))
    if (state.formData?.id) {
      await axiosApi().put(apiPath.Product.add, state.formData)
        .then(r => common.showMessage('محصول با موفقیت ویرایش شد'))
        .catch(e => common.showError(e?.data?.messages))
        formatCurrency()
        formatCount()
    }
    else {
      await axiosApi().post(apiPath.Product.add, state.formData)
        .then(r => common.showMessage('محصول با موفقیت ذخیره شد'))
        .catch(e => common.showError(e?.data?.messages))
        formatCurrency()
        formatCount()
    }
  }
}

const load = async () => {
  if (Number(route.params.id))
    await axiosApi().get(apiPath.Product.getById(route.params.id))
      .then(r => {
        state.formData = r.data
        state.selectedImage = state.formData.imageList.find(x=>x.isDefault)
        dashboardbreadcrumbstore().setBreadCrumbs([
          {
            title: 'محصولات',
            disabled: false,
            to: '/dashboard/product/list',
          }, {
            title: state.formData.title,
            disabled: true,
            to: '/dashboard/product/edit/' + state.formData.id,
          }])
          formatCurrency()
          formatCount()
      }).catch(e => common.showError(e?.data?.messages))
      state.loadEditor = true
}

const getFeatures = async () =>{
  const payload = {
    pageSize:100,
  }
  await axiosApi().post(apiPath.tag.getAll,payload)
    .then(res=>{
      state.tags = res.data
    })
    .catch(e => common.showError(e?.data?.messages))
}

const getAllCategory = async () => {
  await axiosApi().get(apiPath.Category.get.all)
  .then((res) => {
    state.categoryList = res.data;
    state.selectedreadonlyCategories = state.categoryList?.data?.filter(x=>state.selectedCategories.includes(x.id))
  }).catch((error) => common.showError(error?.data?.messages))
}

const addNewFeature = () => {
  if (!Array.isArray(state.formData.tagList)) {
    state.formData.tagList = [];
  }
  
  if (state.formData.tagList.length === 0 || state.formData.tagList.at(-1)?.title !== null) {
    state.formData.tagList.push({
      id: null,
      title: null,
    });
  }
};


const removeFeature = (item) => {
  state.formData.tagList = state.formData.tagList.filter(x => x.id != item.id)
}

const setFeatureTitle = (event,item) => {
  if (!event) getFeatures();
  if(event && event.id){
    item.title = event.title;
    item.id = event.id;
    return
  }
  item.id = null
}

const setNewFeatureTitle = async (event,item) => {
  if(!item.id && event.target.value && event.target.value != '' && event.target.value.trim()){
    const payload = {
      title: event.target.value.trim()
    }
    item.id = await addTag(payload)
    item.title = payload.title
  }
}

const addTag = async (payload) =>{
  return await axiosApi().post(apiPath.tag.add,payload)
  .then(res=>res.data)
  .catch(e=>common.showError(e.data?.messages))
}


const formatCurrency = () => {
  let value = state.formData.price;
  value = value.toString().replace(/,/g, '');
  if (!isNaN(value) && value !== '') {
    state.formData.price = parseInt(value).toLocaleString();
  } else {
    state.formData.price = '';
  }
};

const formatCount = () => {
  let value = state.formData.count;
  value = value.toString().replace(/,/g, '');
  if (!isNaN(value) && value !== '') {
    state.formData.count = parseInt(value).toLocaleString();
  } else {
    state.formData.count = '';
  }
};

const uploadImage = (value) => {
  const maxLength = 3
  if (state.formData.imageList.length < maxLength) state.formData.imageList.push({ id: value, isDefault: false })
  state.formData.imageList.find(x=>x).isDefault = true
  state.selectedImage = state.formData.imageList.find(x=>x)
}

const deleteUploadedImage = () => {
  state.formData.imageList = state.formData.imageList.filter(image => image.id != state.selectedImage.id);
  if(state.formData.imageList.length > 0 && state.selectedImage.isDefault){
    state.formData.imageList.find(x => x).isDefault = true
  }
  if(state.formData.imageList.length > 0) state.selectedImage = state.formData.imageList.find(x=>x)
  else state.selectedImage = null
}

const setToPrimaryImage = () => {
    state.formData.imageList.forEach(image => {
        image.isDefault = false
    });
    state.formData.imageList.find(image => image.id == state.selectedImage.id).isDefault = true
    state.imageError = false
}

const setCategoryId = () =>{
  const temp = state.formData.categoryId
  state.formData.categoryId = parseInt(temp.find(x=>x))
}

</script>
<template>
  <v-form @submit.prevent="save" ref="verifyForm">
    <v-row>
      <v-col cols="12" md="8" lg="9">
        <v-card>
          <v-card-text>
            <v-text-field v-model="state.formData.title" variant="outlined" size="x-large" label="عنوان محصول*"
              :rules="validator.content.title" counter="100" counter-value></v-text-field>

            <BaseCategorySelect v-model="state.formData.categoryId" label="دسته بندی*" :items="state.categoryList" :rules="validator.content.categoryId" class="mt-1" @update:model-value="setCategoryId" :multiple="false"/>


            <BaseCurrencyField  v-model="state.formData.price" label="قیمت*" variant="outlined" size="x-large" prefix="تومان " :rules="validator.content.price" class="mt-1"/>

            <v-text-field v-model="state.formData.count" label="تعداد*" variant="outlined" size="x-large" prefix="عدد "
              @input="formatCount" :rules="validator.content.count"></v-text-field>
            
            <BaseTiptap v-if="state.loadEditor" v-model="state.formData.description" label="خلاصه ویژگی های محصول"/>

            <v-btn class="bg-blue mt-5" size="x-large" width="300" @click="addNewFeature">+ | افزودن ویژگی</v-btn>
            <p v-if="state.formData.tagList.length == 0" class="text-16 text-red mt-3">افزودن حداقل یک ویژگی الزامی است.</p>
            <v-row no-gutters class="ga-3" v-for="(item, index) in state.formData.tagList" :key="index">
              <v-col>
                <v-combobox v-model="item.title" class="mt-5" variant="outlined" size="x-large" label="عنوان ویژگی*" :items="state.tags"
                  :rules="validator.content.feature" @update:model-value="setFeatureTitle($event,item)" @blur="setNewFeatureTitle($event,item)"/>
              </v-col>
              <v-col>
                <v-text-field v-model="item.value" class="mt-5" variant="outlined" size="x-large" label="مقدار ویژگی*"
                  :rules="validator.content.feature" append-icon="mdi-close text-red"
                  @click:append="removeFeature(item)"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" lg="3">


        <v-card class="mb-5">
          <v-card-text>
            <v-btn block type="submit" class="bg-blue-grey-lighten-1" size="x-large">ذخیره</v-btn>
            <v-divider class="mt-4"></v-divider>
            <div class="d-flex">
              <label class="mt-4">انتشار محصول</label>
              <v-switch v-model="state.formData.isActive" class="d-inline-flex justify-end"
                :false-value="false" :true-value="true" color="green"></v-switch>
            </div>
            <div class="d-flex" v-if="state.formData.isActive == 1">
              <label class="mt-4">فروش ویژه</label>
              <v-switch v-model="state.formData.specialSale" class="d-inline-flex justify-end"
                :false-value="false" :true-value="true" color="green"></v-switch>
            </div>
            <div class="d-flex" v-if="state.formData.isActive == 1">
              <label class="mt-4">نمایش نظرات</label>
              <v-switch v-model="state.formData.isCommentActive" class="d-inline-flex justify-end"
                :false-value="false" :true-value="true" color="green"></v-switch>
            </div>
            <div class="d-flex" v-if="state.formData.isCommentActive">
              <label class="mt-4">نمایش خودکار نظرات</label>
              <v-switch v-model="state.formData.isAutoPublishActive" class="d-inline-flex justify-end"
                :false-value="false" :true-value="true" color="green"></v-switch>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <Uploader @update:model-value="uploadImage" :hasImage="false" :multiple="false" :is-private="false"/>
          <BaseImage v-if="state.formData?.imageList?.length > 0" :src="state.selectedImage.id" class="mt-1" />
          <div class="mx-3">
            <v-btn v-if="state.selectedImage" class="bg-green w-50" prepend-icon="mdi-check" @click="setToPrimaryImage" :disabled="state.selectedImage?.isDefault">عکس شاخص</v-btn>
            <v-btn v-if="state.selectedImage" class="bg-red w-50" prepend-icon="mdi-delete-forever" @click="deleteUploadedImage">حذف</v-btn>
          </div>
          <div v-if="state.formData?.imageList.length > 0" class="d-flex justify-center ga-1 mb-1 mt-1">
              <BaseImage v-for="image in state.formData?.imageList" class="border" style="max-width: 50px;cursor: pointer;" :src="image.id" @click="state.selectedImage = image" />
          </div>
          <p v-if="state.imageError && state.formData?.imageList.length == 0" class="px-5 py-1 text-red">بارگزاری حداقل یک عکس الزامی است.</p>
        </v-card>

        <v-card class="mb-5">
          <v-card-title class="d-flex">
            <span>برچسب ها </span>
            <v-card variant="text" icon rounded>
              <v-icon size="16">mdi-help-circle-outline</v-icon>
              <v-tooltip activator="parent" location="top">
                <small>(برچسب ها برای نمایش در موتور های جستجو استفاده میشوند)</small>
              </v-tooltip>
            </v-card>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-combobox v-model="state.formData.keywords" chips clearable multiple filled placeholder="مثال: برچسب (enter)"
              variant="outlined" :rules="validator.content.keywords" hide-details>
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip small v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
                  {{ item }}
                </v-chip>
              </template>
            </v-combobox>
            <p class="text-orange">
              <small>
                <v-icon>mdi-information-outline</v-icon>
                <span class="mr-1">برای ثبت برچسب بعد از اتمام کلید Enter را فشار دهید</span>
              </small>
              </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>