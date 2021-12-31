<template>
	<v-card class="mx-1 mb-1" max-width="400">
		<v-card-title class="pa-6 pb-6">
			<p>{{ account.name }}</p>
		</v-card-title>
		<v-card-subtitle class="pb-0">
			<p v-if="empty" class="mb-0">Absence de compte mensuel</p>
			<p v-else class="mb-0">Ajout de comptes mensuels</p>
		</v-card-subtitle>
		<v-divider class="mx-4"></v-divider>
		<v-card-text class="mt-2 px-4 py-2 pt-0">
			<v-row v-if="empty" no-gutters class="pb-0" align="center">
				<p>Ce compte ne semble pas posséder de compte mensuels.</p>
				<p>Il est nécessaire d'en créer pour pouvoir gérer un compte courant.</p>
			</v-row>
			<v-row no-gutters class="pb-0" align="center">
				<p>Choisissez l'année que vous souhaitez et cliquez sur le bouton <strong>Ajouter</strong> ci-dessous</p>
			</v-row>
			<v-row no-gutters class="pb-5" align="center">
				<SelectYear v-model="selectedYear" />
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-row class="d-flex justify-center pb-4">
				<!-- On affiche le bouton Annuler seulement si ce n'est pas la vue vide ! -->
				<v-btn v-if="!empty" @click="close" class="mr-2">Annuler</v-btn>
				<v-btn color="secondary" class="text-capitalize button-shadow mr-1" @click="addMonthlyAccounts()">Ajouter</v-btn>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';
import SelectYear from './SelectYear';

export default {
	name: 'CardAddMonthlyAccount',

	components: {
		SelectYear,
	},

	props: {
		account: Object,
		empty: Boolean,
		dialog: Boolean,
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
				this.close();
			} else {
				this.showSnackbar({ name: 'alertMACreatingYearError' });
			}
		},

		close() {
			this.$emit('input', false);
		},
	},
};
</script>
