<template>
	<v-app>
		<router-view />

		<!-- Partie Alerte notification -->
		<v-snackbar
			v-for="(snackbar, index) in snackbars.filter(s => s.showing)"
			:key="snackbar.text + Math.random()"
			:value="snackbar.showing"
			@input="removeSnackbar(snackbar)"
			top
			timeout="2500"
			:color="snackbar.color"
			:style="`top: ${index * 60}px`"
		>
			{{ snackbar.text }}
			<template v-slot:action="{ attrs }">
				<v-btn :color="snackbar.colorBtnClose" text v-bind="attrs" @click="removeSnackbar(snackbar)">Close</v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'App',

	methods: {
		/**
		 * Supprime un snackbar du tableau des snackbars
		 */
		removeSnackbar(snackbar) {
			this.$store.dispatch('snackbar/removeSnackbar', snackbar);
		}
	},

	computed: {
		...mapGetters({
			snackbars: 'snackbar/getSnackbars', // Récupère dynamiquement le tableau des snackbars
		}),
	},
};
</script>

<style src="./styles/app.scss" lang="scss" />
