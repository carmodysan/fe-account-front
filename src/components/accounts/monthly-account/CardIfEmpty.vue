<template>
	<v-row class="d-flex justify-center mt-10 mb-1">
		<v-card class="mx-1 mb-1" max-width="290">
			<v-card-title class="pa-6 pb-6">
				<p>{{ account.name }}</p>
			</v-card-title>
			<v-card-subtitle class="pb-0">
				<p class="mb-0">Absence de compte mensuel</p>
			</v-card-subtitle>
			<v-divider class="mx-4"></v-divider>
			<v-card-text class="mt-2 px-4 py-2 pt-0">
				<v-row no-gutters class="pb-0" align="center">
					<p>Ce compte ne semble pas posséder de compte mensuels.</p>
					<p>Il est nécessaire d'en créer pour pouvoir gérer un compte courant.</p>
					<p>Choisissez l'année que vous souhaitez et cliquez sur le bouton <strong>Ajouter</strong> ci-dessous</p>
				</v-row>
				<v-row no-gutters class="pb-5" align="center">
					<SelectYear v-model="selectedYear" />
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-row class="d-flex justify-center pb-4">
					<v-btn color="secondary" class="text-capitalize button-shadow" @click="addMonthlyAccounts()">Ajouter</v-btn>
				</v-row>
			</v-card-actions>
		</v-card>
	</v-row>
</template>

<script>
import { mapActions } from 'vuex';
import SelectYear from './SelectYear';

export default {
	name: 'CardIfEmpty',

	components: {
		SelectYear,
	},

	props: {
		account: Object,
	},

	data() {
		return {
			selectedYear: 0,
		};
	},

	methods: {
		...mapActions({
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
			createMonthlyAccounts: 'accountDetails/createMonthlyAccounts', // Créé les 12 comptes mensuels en fonction de l'année choisie.
		}),

		/**
		 * Ajoute 12 comptes mensuels au compte courant.
		 */
		addMonthlyAccounts() {
			if (this.selectedYear != 0) {
				this.createMonthlyAccounts(this.selectedYear); // On crée les 12 comptes mensuels
			} else {
				this.showSnackbar({ name: 'alertMACreatingYearError' });
			}
		},
	},
};
</script>
