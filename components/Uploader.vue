<script setup>
import no_image from '@/assets/img/no-image-icon.png'
const props = defineProps(["modelValue","class","disabled","multiple","style","alt","hasImage","hasButton","text","btnClass","label","labelClass"])
const emits = defineEmits(["update:modelValue"])
const config = useRuntimeConfig()
const image = ref(no_image)
const input = ref()
const loading =ref(false)

onMounted(() => {
  if (props.modelValue && props.modelValue != ''){
    show(`${props.modelValue}`)
  }
})

watch(() => (props.modelValue), () => {
  if (props.modelValue && props.modelValue != ''){
    show(`${props.modelValue}`)
  }
})

const show = async (payload) =>{
  image.value = `${config.public.baseURL}${apiPath.File.url}${payload}`
}

const fileUploadSelect = (event) => {
  loading.value = true
  let files = event.target.files
  for(let file of files){
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      uploadFile(formData)
    }
  }
}

async function uploadFile(formData) {
  let uploadedImage = await axiosApi(40).post('user/Files', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then(r => r.data)
  .catch(e => console.error(e?.data?.messages))
  loading.value = false
  show(`${uploadedImage}`)
  emits("update:modelValue", uploadedImage)
}
</script>

<template>
  <div :class="[props.disabled ? 'container' : 'selectableContainer',`${props.class ?? ''}`]" @click="loading && (props.disabled ?? false) ? '' : input.click()" :style="props.style">
    <p v-if="props.labelClass" :class="props.labelClass">{{ props.label }}</p>
    <img v-if="props.hasImage ?? true" :src="image" class="w-100 h-100" :alt="props.alt"/>
    <input v-if="!loading" ref="input" type="file" class="d-none" @change="fileUploadSelect" accept="image/png, image/gif, image/jpeg" :multiple="props.multiple ?? false" :disabled="props.disabled">
    <button v-if="props.hasButton ?? true" type="button" class="btn" :class="props.btnClass">{{ props.text ? props.text : 'بارگزاری عکس' }}</button>
  </div>
</template>

<style scoped>
.selectableContainer{
  position: relative;
  cursor: pointer;
}
.container{
  position: relative;
}
.btn{
  background-color: #2196F3;
  width: 100%;
  border-radius: 3px;
  height: 40px;
  color: #ffffff;
  transition: all linear .1s;
  /* margin-bottom: 5px; */
}
.btn:hover{
  background-color: #1b84db;
}
</style>