import Vue from 'vue'
<%_ if (features.includes('vuex')) { _%>
import store from './store'
<%_ } _%>
<%_ if (features.includes('router')) { _%>
import router from './router'
<%_ } _%>
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
<%_ if (features.includes('vuex')) { _%>
    store,
<%_ } _%>
<%_ if (features.includes('router')) { _%>
    router,
<%_ } _%>
    render: (h) => h(App),
}).$mount('#app')