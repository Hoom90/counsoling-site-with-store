<script setup>
import no_image from '@/assets/img/no-image-icon.png';
const config = useRuntimeConfig()
const props = defineProps(['src', 'path', 'class', 'noImage', 'ratio', 'isThumbnail', 'alt', 'style']);
const emits = defineEmits(['update:modelValue', 'click']);
const image = ref(no_image);

const setUrl = async (payload) => {
  image.value = config.public.baseURL + apiPath.File.url + (props.isThumbnail ? 'thumbnail/' : '') + payload
};

const loadImage = () => {
  if (props.src) {
    setUrl(props.src);
  } else if (props.path) {
    image.value = props.path;
  } else if (props.noImage){
    image.value = props.noImage
  } else{
    image.value = no_image
  }
};

onMounted(loadImage);
watch(() => props.src, loadImage);
watch(() => props.path, loadImage);
</script>

<template>
  <v-img :src="image" :class="props.class" :style="props.style" :alt="props.alt ?? 'دایه'" @click="emits('click')" />
</template>
<style>
img {
  object-fit: cover !important;
}
</style>