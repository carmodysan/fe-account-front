<template>
	<v-app>
		<router-view />

		<!-- Partie Alerte notification -->
		<v-snackbar
			v-for="(snackbar, index) in snackbars.filter((s) => s.showing)"
			:key="snackbar.text + Math.random()"
			:value="snackbar.showing"
			@input="removeSnackbar(snackbar)"
			top
			timeout="2500"
			:color="snackbar.color"
			:style="`top: ${index * 60}px`"
		>
			<v-icon color="blue-grey lighten-5">{{ snackbar.icon }}</v-icon>
			{{ snackbar.text }}
			<template v-slot:action="{ attrs }">
				<v-btn :color="snackbar.colorBtnClose" text v-bind="attrs" @click="removeSnackbar(snackbar)">Close</v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EventBus from './common/EventBus';

export default {
	name: 'App',

	metaInfo: {
		title: '',
		titleTemplate: '%s - FacilEpargne | La gestion de vos comptes',
	},

	methods: {
		...mapActions({
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
		}),

		/**
		 * Lance la déconnexion
		 */
		logOut() {
			this.$store.dispatch('auth/logout');
			this.showSnackbar({ name: 'alertLogoutSessionTimeout' });
			this.$router.replace({ name: 'Login' });
		},

		/**
		 * Supprime un snackbar du tableau des snackbars
		 */
		removeSnackbar(snackbar) {
			this.$store.dispatch('snackbar/removeSnackbar', snackbar);
		},
	},

	computed: {
		...mapGetters({
			snackbars: 'snackbar/getSnackbars', // Récupère dynamiquement le tableau des snackbars
		}),
	},

	mounted() {
		EventBus.on('logout', () => {
			this.logOut();
		});
	},

	beforeDestroy() {
		EventBus.remove('logout');
	},
};
</script>

<style src="./styles/app.scss" lang="scss" />
