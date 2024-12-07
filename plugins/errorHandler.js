export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // console.log(error);
    // console.log(instance);
    // console.log(info);
    // handle error, e.g. report to a service
  };

  // Also possible
  // nuxtApp.hook('vue:error', (error, instance, info) => {
  //   // handle error, e.g. report to a service
  // })
});
  