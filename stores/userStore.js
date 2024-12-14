
export const userStore = defineStore('user', {
  state: () => ({
    mobile: '',
    registerToken: '',
    token: null,
    roles: [],
    profile: {},
    favorite: {},
    theme:null,
  }),
  getters: {
    getMobile: (state) => state.mobile,
    getRegisterToken: (state) => state.registerToken,
    getAuth: (state) => state.token ? true : false,
    getIsAdmin: (state) => (state.roles?.some(x => x == 'admin')),
    getRoles: (state) => state.roles,
    getIsInRole: (state, role) => state.roles?.some(x => x == role),
    getUser:(state)=> state.profile,
    getFavorite: (state) => state.favorite,
    getIsConsultant: (state) => (state.roles?.some(x => x == 'expert')),
    getTheme: (state) => state.theme,
  },
  actions: {
    setTheme(theme) { 
      this.theme = theme
    },
    setMobile(mobile) {
      this.mobile = mobile
    },
    setRegisterToken(token) {
      this.registerToken = token
    },
    setAuth(token) { this.token = token },
    setLogOut() {
      this.token = null
      this.roles = []
      this.mobile = ''
      this.registerToken = ''
      this.profile={}
    },
    setUser(user) {
      this.profile = user
      this.roles=user?.roles
    },
    setFavorite(favorite){
      this.favorite = favorite
    },
  }
})