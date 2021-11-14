import Vue from "vue";
import App from "./components/App";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import axios from "axios";

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL_API;

require("./store/subscriber");

store.dispatch("auth/attempt", localStorage.getItem("token")).then(() => {
	new Vue({
		router,
		store,
		vuetify,
		render: (h) => h(App),
	}).$mount("#app");
});
