<script setup>
const props = defineProps({
    isActive: { type: Boolean, required: true },
    imageList: { type: Array, required: true },
});
const emits = defineEmits(['isNotActive']);
const currentImage = ref(props.imageList.find(x => x));
const changeCurrentImage = (item) => {
    currentImage.value = item;
};
</script>

<template>
    <v-overlay v-model="props.isActive" class="bg-black">
        <v-card variant="text" class="d-flex flex-column align-center justify-center" style="width: 100vw;height: 100vh;">

            <v-btn icon="mdi-close" class="position-absolute bg-white border-none rounded top-20px right-15px" @click="emits('isNotActive')"></v-btn>

            <div class="d-flex w-100 mb-3">
                <BaseImage :src="currentImage.id" class="mx-auto max-width-800px" />
            </div>

            <div class="position-absolute d-flex ga-3 transform-center bottom-15px">
                <BaseImage v-for="(item, index) in props.imageList" :key="index" :src="item.id" class="width-50px cursor-pointer" @click="changeCurrentImage(item)" />
            </div>
        </v-card>
    </v-overlay>
</template>
<style scoped>
.top-20px{
    top: 20px;
}
.right-15px{
    right: 15px;
}
.max-width-800px{
    max-width: 800px;
}
.width-50px{
    width: 50px;
}
.transform-center{
    left: 50%;
    transform: translateX(-50%);
}
.bottom-15px{
    bottom: 15px;
}
</style>