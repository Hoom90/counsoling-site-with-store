<script setup>
const props = defineProps(["isClose","categories"])

const panel = ref(props.isClose)

</script>
<template>
    <div class="fixed-bar">
        <v-text-field label="دنبال چی میگردی ..." variant="solo-inverted" append-inner-icon="mdi-magnify"
            rounded="xl"></v-text-field>
        <v-expansion-panels class="rounded-xl" v-model="panel" multiple>

            <v-expansion-panel class="rounded-xl" title="تالار های گفتگو">
                <v-expansion-panel-text v-if="props.categories">
                    <v-btn variant="flat" block class="mb-2" color="theme-blue" to="/forum">
                        <span>همه تالارها</span>
                    </v-btn>
                    <v-btn variant="flat" v-for="item in props.categories" :key="item.id" block class="mb-2"
                        color="theme-blue" :to="`/forum/${item.id}-${item.title.replaceAll(' ','-')}`">
                        <span>تالار {{ item.title }}</span>
                    </v-btn>
                </v-expansion-panel-text>
                <v-expansion-panel-text v-else>
                    <span>
                        بدون تالار گفتگو...
                    </span>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>