<script setup>
import no_image from '@/assets/img/no-image-icon.png';
const config = useRuntimeConfig();
const props = defineProps({
  src: String,
  path: String,
  class: String,
  noImage: String,
  ratio: String,
  isThumbnail: Boolean,
  alt: String,
  style: String,
});
const emits = defineEmits(['update:modelValue', 'click']);
const image = ref(no_image);

 const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
};

const setUrl = async (payload) => {
  const url = `${config.public.baseURL}${apiPath.File.url}${props.isThumbnail ? 'thumbnail/' : ''}${payload}`;
  if (await checkImageExists(url)) {
    image.value = url;
  } else {
    image.value = props.noImage || no_image;
  }
};

const loadImage = () => {
  if (props.src) {
    setUrl(props.src);
  } else if (props.path) {
    image.value = props.path;
  } else {
    image.value = props.noImage || no_image;
  }
};

onMounted(loadImage);
watch(() => props.src, loadImage);
watch(() => props.path, loadImage);
</script>

<template>
  <v-img
    :src="image"
    :class="props.class"
    :style="props.style"
    :alt="props.alt ?? 'دایه'"
    @click="emits('click')"
  />
</template>
<style>
img {
  object-fit: cover !important;
}
</style>