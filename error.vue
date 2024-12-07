<script setup>
defineProps(['error'])
import image from "@/assets/svg/404.svg"
</script>
<template>
    <div class="container">
        <div class="wrapper">
            <template v-if="error.statusCode == '404'">
                <v-img :src="image" class="w-100"/>
                <div>
                    <h3>
                        متاسفانه صفحه مورد نظر یافت نشد.
                    </h3>
                    <div>
                    <v-btn color="teal" class="mt-5" @click="$router.push('/')">بازگشت به خانه</v-btn>
                    </div>
                </div>
            </template>
            <template v-else>
                <h3>اخ اخ</h3>
                <div>{{ error.message }}</div>                    
            </template>
        </div>
    </div>
</template>
<style scoped>
.container{
    height: calc(100vh - 64px - 56px);display: flex;justify-content: center;align-items: center;
}
.wrapper{
    display: flex;flex-direction: column;align-items: center;justify-content: center;gap:2rem;text-align: center;
}
</style>