<script setup>
const props = defineProps(['modelValue', 'title', 'class', 'style', 'width', 'persistent', 'confirmBtnText', 'confirmBtnIcon', 'confirmBtnClass' , 'closeBtnText', 'closeBtnIcon'])
const emits = defineEmits(['update:modelValue', 'confirm'])

const confirmBtnText = computed(() => props.confirmBtnText ?? 'تایید')
const confirmBtnIcon = computed(() => props.confirmBtnIcon ?? 'mdi-check')
const closeBtnText = computed(() => props.closeBtnIcon ?? 'لغو')
const closeBtnIcon = computed(() => props.closeBtnIcon ?? 'mdi-close')
</script>

<template>
    <v-dialog v-model="props.modelValue" :class="props.class" :style="props.style" :persistent="props.persistent"
        :width="props.width">
        <v-card>
            <v-toolbar density="compact">
                <v-btn v-if="props.persistent" icon dark @click="emits('update:modelValue')">
                    <v-icon>{{ closeBtnIcon }}</v-icon>
                </v-btn>
                <v-toolbar-title :class="props.persistent ? '' : 'text-center'">{{ props.title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <slot />
            </v-card-text>
            <v-card-actions class="d-flex justify-space-around">
                <v-btn :class="props.confirmBtnClass" color="info" @click="emits('confirm')">
                    <v-icon v-if="confirmBtnIcon">{{ confirmBtnIcon }}</v-icon>
                    <span>{{ confirmBtnText }}</span>
                </v-btn>
                <v-btn v-if="!props.persistent" color="red" @click="emits('update:modelValue')">
                    <v-icon v-if="closeBtnIcon">{{ closeBtnIcon }}</v-icon>
                    <span>{{ closeBtnText }}</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
