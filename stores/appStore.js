
export const appStore = defineStore('app', {
    state: () => ({
        loading: true,
    }),
    getters: {
        getLoading: (state) => state.loading,
    },
    actions: {
        setloading(status) {this.loading = status}
    },
})