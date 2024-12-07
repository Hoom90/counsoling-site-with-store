<script setup>
const props = defineProps({
  modelValue: String,
  setError: Boolean,
  label: String,
  rules: String,
});
const emits = defineEmits(["update:modelValue"]);

const errorOccured = ref(false);
const editor = useEditor({
  content: props.modelValue,
  extensions: [TiptapStarterKit],
  onUpdate: ({ editor }) => emits('update:modelValue', validateContent(editor.getHTML())),
  onBlur: ({ editor }) => emits('update:modelValue', validateContent(editor.getHTML())),
});

const validateContent = (htmlContent) => {
  const emptyTagPattern = /^<\w+>\s*<\/\w+>$/; // تگ خالی
  const nestedEmptyTagPattern = /^<\w+>\s*(<\w+>\s*<\/\w+>)\s*<\/\w+>$/; // تگ تودرتو خالی

  if (!htmlContent || emptyTagPattern.test(htmlContent) || nestedEmptyTagPattern.test(htmlContent)) {
    document.querySelector('.tiptap .ProseMirror').classList.add('border-error')
    errorOccured.value = true;
    return false
  } else {
    document.querySelector('.tiptap .ProseMirror').classList.remove('border-error')
    errorOccured.value = false;
    return true
  }
};

const labelClasses = computed(() => ({
  "color-error": errorOccured.value,
}));

onBeforeUnmount(() => {
  unref(editor).destroy();
});

defineExpose({
  validateContent
})
</script>

<template>
  <div class="tiptap">
    <p v-if="label" :class="labelClasses">{{ label }}</p>
    <TiptapEditorContent :editor="editor"/>
    <span v-if="rules" v-show="rules && errorOccured" class="validator">{{ rules }}</span>
  </div>
</template>

<style>
.tiptap .ProseMirror {
  border: 1px solid #00000052;
  border-radius: 4px;
  height: 200px;
  padding: 12px;
  overflow-y: auto;
}
.tiptap .border-error{
  border-color: #b00020;
  outline-color: #b00020;
}
.tiptap .validator{
  margin-right: 20px;
  font-size: 12px;
  color: #b00020;
}
.tiptap .color-error{
  color: #b00020;
}
</style>



// npx nuxi@latest module add tiptap
// export default defineNuxtConfig({
//   modules: ['nuxt-tiptap-editor'],
//   tiptap: {
//     prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
//   },
// });