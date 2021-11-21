<template>
	<v-container fill-height fluid>
		<!-- Quand il n'y a pas de compte mensuel de créé -->
		<v-row v-if="user.monthlyAccounts.length == 0" align="center" justify="center">
			<div v-if="!isFirstMACreating">
				<v-btn fab dark large @click="createFirstMA"><v-icon>mdi-text-box-plus-outline</v-icon></v-btn>
			</div>
			<div v-else>
				<v-row class="fill-height" align-content="center" justify="center">
					<v-col class="text-subtitle-1 text-center" cols="12"> Creating monthly accounts...</v-col>
					<v-col cols="6">
						<v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
					</v-col>
				</v-row>
			</div>
		</v-row>

		<!-- Si un ou plusieurs comptes mensuels existent déjà -->
		<v-row v-else align="center" justify="center" class="d-flex flex-column">
			<div v-if="isMALoading">
				<v-row class="fill-height" align-content="center" justify="center">
					<v-col class="text-subtitle-1 text-center" cols="12"> Loading monthly accounts...</v-col>
					<v-col cols="6">
						<v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
					</v-col>
				</v-row>
			</div>
			<div v-else>
				{{ monthlyAccount.length }} monthly accounts created !
			</div>
		</v-row>
	</v-container>
</template>

<style lang="sass" scoped>
$progress-circular-overlay-transition: all .1s ease-in-out !default
</style>

<script>
// TODO Créer les composants pour un affichage correct de tous les monthlyAccounts
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
export default {
	name: 'Dashboard',

	data: () => ({
		absolute: true,
		isFirstMACreating: false,
		isMALoading: false,
		monthlyAccount: [],
	}),

	methods: {
		...mapActions({
			reload: 'auth/reloadUser',
		}),

		async getMonthlyAccounts() {
			await axios
				.get('/monthly_accounts')
				.then((response) => {
					this.monthly_accounts = response.data['hydra:member'];
				})
				.finally(() => {});
		},

		/**
		 * Fonction appelée si aucun compte mensuel (MA) existe.
		 * Récupère l'année courante et créé les 12 comptes mensuels de l'année
		 */
		async createFirstMA() {
			// On active le loader, il ne sera désactiver que quand maItemsCount aura changé (grâce au watch)
			this.isFirstMACreating = true;

			// On récupère l'année courante
			const d = new Date();
			let year = d.getFullYear();

			try {
				for (let month = 1; month <= 12; month++) {
					const element = '{"year": ' + year + ', "month": ' + month + '}';
					let ma = JSON.parse(element);
					await axios.post('/monthly_accounts', ma).finally(() => {
						console.log(element + ' created.');
					});
				}
			} catch (error) {
				// TODO Gestion de l'exception
			} finally {
				await this.reload();
			}
		},

		async getMAItems(isFirst) {
			try {
				if (!isFirst) this.isMALoading = true;

				// On parcourt tous les comptes mensuels de l'utilisateur
				for (let index = 0; index < this.user.monthlyAccounts.length; index++) {
					const ma = this.user.monthlyAccounts[index]; // On récupère le compte mensuel (MA)
					const url = '/monthly_accounts/' + ma.id; // On construit l'url pour récupérer via API le compte mensuel
					console.log(url);
					let response = await axios
						.get(url)
						.then((response) => response.data)
						.finally(() => {
							console.log(index);
							if (index == 11) {
								this.isFirstMACreating = false; // On désactive le loader s'il était activé
								this.isMALoading = false; // On désactive le loader s'il était activé
								console.log('loader deactivated')
							}
						});
					this.monthlyAccount.push(response);
				}
			} catch (error) {
				// TODO Gestion de l'exception
			}
		},
	},

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),

		maItemsCount() {
			return this.user.monthlyAccounts.length;
		},
	},

	watch: {
		maItemsCount() {
			this.getMAItems(true);
		},
	},

	created() {
		if (this.user.monthlyAccounts.length > 0) {
			this.getMAItems(false);
		}
	},
};
</script>
