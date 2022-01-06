<template>
	<v-container fill-height fluid>
		<!-- Partie paramètres -->
		<v-row>
			<v-col class="text-right">
				<v-btn large :to="{ name: 'periodic-operations', params: { authorId: user.id } }"><v-icon>mdi-cog</v-icon></v-btn>
			</v-col>
		</v-row>

		<!-- Partie chargement du compte -->
		<div v-if="isAccountLoading && isMonthlyAccountsLoading">
			<v-row class="fill-height" align-content="center" justify="center">
				<v-col class="text-subtitle-1 text-center" cols="12">Chargement du compte en cours</v-col>
				<v-col cols="6">
					<v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
				</v-col>
			</v-row>
		</div>
		<div v-else>
			<v-row>
				<v-col>
					<v-dialog max-width="300" v-model="createDialog" persistent>
						<template v-slot:activator="{ on, attrs }">
							<v-btn fab dark large v-bind="attrs" v-on="on"><v-icon>mdi-text-box-plus-outline</v-icon></v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="text-h5">Sélectionner une année</span>
							</v-card-title>
							<v-card-text>
								<v-select :items="years" label="Année" v-model="selectedYear"></v-select>
							</v-card-text>
							<v-card-actions>
								<v-btn color="failure" class="mr-4" @click="createDialog = false">Annuler</v-btn>
								<v-btn
									color="failure"
									class="mr-2"
									@click="
										createDialog = false;
										createMonthlyAccounts();
									"
									>Envoyer</v-btn
								>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-col>
			</v-row>

			<!-- Quand il n'y a pas de compte mensuel de créé -->
			<v-row v-if="isMonthlyAccountsCreating" class="fill-height" align-content="center" justify="center">
				<v-col class="text-subtitle-1 text-center" cols="12"> Creating monthly accounts...</v-col>
				<v-col cols="6">
					<v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
				</v-col>
			</v-row>

			<!-- Si un ou plusieurs comptes mensuels existent déjà -->
			<v-row v-else align="center" justify="center" class="fill-height overflow-auto">
				<v-col v-for="item in orderedMonthlyAccounts" :key="item.id" :cols="itemsPerRow" class="py-2">
					<v-hover v-slot="{ hover }">
						<v-card class="card fill-height" :elevation="hover ? 16 : 2" :class="{ 'on-hover': hover }" max-width="300">
							<v-img :src="require(`../../assets/images/card_${item.month}.jpg`)" width="100%" height="200"></v-img>
							<v-card-title>
								<span class="font-weight-light text-truncate"> {{ item.month | formatMonth }} {{ item.year }} </span>
							</v-card-title>
							<v-divider></v-divider>
							<v-card-text>
								<v-row justify="space-around">
									<v-chip class="mx-2 my-auto" color="green" text-color="white">
										<v-avatar left class="green darken-4"> {{ item.operations.length }} </v-avatar>
										Opérations
									</v-chip>
									<v-btn
										class="ma-2"
										fab
										small
										dark
										color="teal"
										:to="{
											name: 'operations-list',
											params: { slug: item.slug, ma: item, accountDetailsId: accountDetailsId, accountDetailsSlug: accountDetailsSlug },
										}"
									>
										<v-icon dark>mdi-eye
											<!-- {{ item.operations.length == 0 ? 'mdi-playlist-plus' : 'mdi-eye'}} -->
										</v-icon>
									</v-btn>
								</v-row>
							</v-card-text>
						</v-card>
					</v-hover>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<style scoped></style>

<script>
import { mapGetters } from 'vuex';
import AccountsDataService from '../../services/AccountsDataService';
import MonthlyAccountsDataService from '../../services/MonthlyAccountsDataService';

export default {
	name: 'account-details',

	data: () => ({
		accountDetailsId: '',
		accountDetailsSlug: '',

		account: Object,
		monthlyAccounts: [],
		allMonthlyAccounts: {},
		isAccountLoading: true,
		isMonthlyAccountsLoading: true,
		show: true,

		createDialog: false,
		years: [2022, 2021, 2020, 2019],
		selectedYear: 2022,
		isMonthlyAccountsCreating: false,
	}),

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),

		orderedMonthlyAccounts: function () {
			return null;
		},

		/**
		 * Définit l'affichage en colonnes des comptes mensuels en fonction de la taille de l'écran'
		 */
		itemsPerRow() {
			switch (this.$vuetify.breakpoint.name) {
				case 'xs':
					return 12;
				case 'sm':
					return 4;
				case 'md':
					return 2;
				case 'lg':
					return 2;
				case 'xl':
					return 2;
				default:
					return 2;
			}
		},
	},

	methods: {
		/**
		 * Récupère le compte courant
		 */
		async retrieveAccount() {
			this.isAccountLoading = true;
			await AccountsDataService.get(this.accountDetailsId)
				.then((response) => {
					this.account = response.data;
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.retrieveMonthlyAccounts();
				});
		},

		/**
		 * Récupère tous les comptes mensuels du compte courant
		 */
		async retrieveMonthlyAccounts() {
			this.isMonthlyAccountsLoading = true;

			await MonthlyAccountsDataService.getAll(this.account.id)
				.then((response) => {
					this.monthlyAccounts = response.data['hydra:member'];
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.isAccountLoading = false;
					this.isMonthlyAccountsLoading = false;
				});
		},

		/**
		 * Créé les 12 comptes mensuels de l'année courante
		 */
		createMonthlyAccounts() {
			this.isMonthlyAccountsCreating = true;
			let compteur = 0;

			try {
				for (let month = 1; month <= 12; month++) {
					// Création de l'objet MonthlyAccounts
					const monthlyAccounts = new Object();
					monthlyAccounts.year = this.selectedYear;
					monthlyAccounts.month = month;
					monthlyAccounts.account = '/api/accounts/' + this.account.id;
					MonthlyAccountsDataService.create(monthlyAccounts)
						.catch((e) => {
							console.log(e);
						})
						.finally(() => {
							compteur += 1;
							if (compteur == 12) {
								this.isMonthlyAccountsCreating = false;
								this.retrieveAccount();
							}
						});
				}
			} catch (error) {
				// TODO Gestion de l'exception
			} finally {
				// Do nothing
			}
		},
	},

	mounted() {
		if (!this.accountDetailsId || this.accountDetailsId === '') {
			this.accountDetailsId = this.$route.params.accountId;
		}
		if (!this.accountDetailsSlug || this.accountDetailsSlug === '') {
			this.accountDetailsSlug = this.$route.params.slug;
		}
		this.retrieveAccount();
	},
    // TODO mettre en place un test pour savoir si la page vient d'être raffraichit et qu'il n'y a pas les infos nécessaires (accountDetailsId et accountDetailsSlug)
};
</script>
