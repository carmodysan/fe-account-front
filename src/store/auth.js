import store from "./index";
import axios from './../services/FEApiService';

export default {
	namespaced: true,

	state: {
		token: null,
		user: null,
	},
	getters: {
		isAuthenticated(state) {
			return state.token && state.user;
		},

		getUser(state) {
			return state.user;
		},
	},
	mutations: {
		setToken(state, token) {
			state.token = token;
		},
		setUser(state, user) {
			state.user = user;
		},
	},
	actions: {
		async login({ dispatch }, credentials) {
			store.commit("setLoading", true);
			let response = await axios.post("/login", credentials).catch((e) => {
				store.commit("setLoading", false);
				throw e; // On laisse la vue gérer l'exception (affichage d'une erreur par exemple)
			});
			return dispatch('attempt', response.data.token);
		},

		async attempt({ commit, state }, token) {
			if (token) {
				commit("setToken", token);
			}

			if (!state.token) {
                return 
			}

            try {
                let response = await axios.get('/profile')
                commit('setUser', JSON.parse(response.data[0]))
            } catch(e) {
                commit('setUser', null)
                commit('setToken', null)
                console.log('error get profile : '+e)
            }

            store.commit('setLoading', false)
		},

		async reloadUser({commit}) {
			try {
                let response = await axios.get('/profile')
                commit('setUser', JSON.parse(response.data[0]))
				console.log('user loaded')
            } catch(e) {
                commit('setUser', null)
                console.log('error get profile : '+e)
            }
		},

        logout({commit}) {
            store.commit('setLoading', true)
            localStorage.removeItem('token')
            commit('setUser', null)
            commit('setToken', null)
            store.commit('setLoading', false)
        },

		async register(_, form) {
			store.commit("setLoading", true);
			return await axios
				.post("/register", form)
				.then(() => {
					store.commit("setLoading", false);
				})
				.catch((e) => {
					store.commit("setLoading", false);
					console.log('error : ' + e)
					//TODO - Faire une page d'affichage d'erreur
				});
		},
	},
};
