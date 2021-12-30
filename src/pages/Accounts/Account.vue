<template>
	<v-container fluid>
		<div class="account-page">
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
				<h1 class="page-title">Comptes</h1>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">Configuration</v-btn>
					</template>
				</v-menu>
			</v-row>
			<v-row>
				<!-- Partie montant total sur les comptes -->
				<v-col lg="4" sm="6" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Montant total sur les comptes</p></v-card-title>
						<v-card-text class="pa-6 pt-0">
							<v-row no-gutters class="pb-5" align="center">
								<v-col cols="5" class="my-auto d-flex align-center" style="min-height: 115px">
									<span class="font-weight-medium card-dark-grey" style="font-size: 24px">5,145.00 €</span>
								</v-col>
								<v-col cols="7">
									<ApexChart v-if="apexLoading" height="35" type="area" :options="apexArea1.options" :series="apexArea1.series"></ApexChart>
								</v-col>
							</v-row>
							<v-row no-gutters class="justify-space-between">
								<div>
									<div class="subtext">5,150.00 €<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Epargne</div>
								</div>
								<div>
									<div class="subtext">300.00 €<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Bourse</div>
								</div>
								<div>
									<div class="subtext">0.00 €<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">Autres</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie Epargnes -->
				<v-col lg="4" sm="6" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Epargnes</p></v-card-title>
						<v-card-text class="pa-6 pt-0">
							<v-row no-gutters class="pb-5">
								<v-col cols="6" class="my-auto">
									<span class="font-weight-medium card-dark-grey" style="font-size: 24px">5,150.00 €<span class="caption error-text">-3.7%</span></span>
								</v-col>
								<v-col cols="6">
									<ApexChart height="100" type="bar" v-if="apexLoading" :options="apexBar1.options" :series="apexBar1.series"></ApexChart>
								</v-col>
							</v-row>
							<v-row no-gutters class="justify-space-between">
								<div>
									<div class="subtext">500.00 €<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Livret</div>
								</div>
								<div>
									<div class="subtext">100.00 €<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">Bourse</div>
								</div>
								<div>
									<div class="subtext">0.00 €<v-icon color="warning"> mdi-arrow-right</v-icon></div>
									<div class="subtext-index">Autres</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie dépenses courantes -->
				<v-col lg="4" sm="6" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Dépenses courantes</p></v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<v-row no-gutters>
								<v-col cols="12" class="d-flex align-center" style="min-height: 181px">
									<ApexChart height="150" type="donut" class="mt-1" :options="apexPie.options" :series="apexPie.series"></ApexChart>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie liste des comptes -->
				<v-col cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6">
							<p>Liste des comptes détenus</p>
							<v-spacer></v-spacer>
							<!-- Partie création d'un compte -->
							<div><DialogCreateAccount v-bind:userId="user.id" /></div>
						</v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<v-skeleton-loader v-if="isAccountsRetrieving" type="table"></v-skeleton-loader>
							<v-data-table v-else disable-pagination hide-default-footer :headers="headers" :items="accounts" item-key="id">
								<template v-slot:[`item.actions`]="{ item }">
									<v-row class="d-flex justify-end mr-2">
										<div>
											<!-- Partie visualisation du compte -->
											<v-tooltip bottom color="primary">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" @click="viewAccount(item.id)" fab outlined elevation="2" small class="mx-2" color="primary">
														<v-icon>mdi-eye</v-icon>
													</v-btn>
												</template>
												<span>Visualiser</span>
											</v-tooltip>
										</div>

										<!-- Partie édition du compte -->
										<div>
											<DialogEditAccount v-bind:item="item" />
										</div>

										<!-- Partie suppression du compte -->
										<div>
											<DialogDeleteAccount v-bind:item="item" />
										</div>
									</v-row>
								</template>
							</v-data-table>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DialogCreateAccount from '../../components/accounts/DialogCreateAccount';
import DialogEditAccount from '../../components/accounts/DialogEditAccount';
import DialogDeleteAccount from '../../components/accounts/DialogDeleteAccount';

import config from '../../config/index';

import ApexChart from 'vue-apexcharts';

export default {
	name: 'Account',

	metaInfo: {
		title: 'Comptes',
	},

	components: {
		ApexChart,
		DialogCreateAccount, // Composant représentant le bouton 'Nouveau compte'
		DialogEditAccount, // Composant représentant le bouton 'Modifier'
		DialogDeleteAccount, // Composant représentant le bouton 'Supprimer'
	},

	data: () => ({
		apexLoading: true,

		// dialogEditAccount: {}, // Objet, car sinon la fenêtre modale s'affiche plusieurs fois quand elle est imbriquée dans un tableau.
		dialogDeleteAccount: {},

		// Juste pour l'exemple
		apexArea1: {
			options: {
				chart: {
					id: 'apexAreaFirst',
					sparkline: {
						enabled: true,
					},
				},
				colors: [config.color.light.secondary],
				fill: {
					type: 'solid',
					opacity: 0.3,
				},
				stroke: {
					width: 2,
					curve: 'smooth',
				},
			},
			series: [
				{
					data: [50, 56, 84, 51, 52, 55, 53],
				},
			],
		},
		apexBar1: {
			options: {
				chart: {
					id: 'chartFirst',
					toolbar: {
						show: false,
					},
				},
				fill: {
					colors: [config.color.light.primary],
					opacity: 1,
				},
				plotOptions: {
					bar: {
						columnWidth: '50%',
						distributed: true,
						endingShape: 'rounded',
						startingShape: 'rounded',
					},
				},
				grid: {
					xaxis: {
						lines: {
							show: false,
						},
					},
					yaxis: {
						lines: {
							show: false,
						},
					},
				},
				dataLabels: {
					enabled: false,
					dropShadow: {
						enable: false,
					},
				},
				legend: {
					show: false,
				},
				xaxis: {
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						show: false,
					},
				},
				yaxis: {
					labels: {
						show: false,
					},
				},
			},
			series: [
				{
					data: [70, 63, 84, 79, 70, 65, 80],
				},
			],
		},
		apexPie: {
			options: {
				dataLabels: {
					enabled: false,
				},
				colors: [config.color.light.primary, config.color.light.secondary, config.color.light.success, config.color.light.warning],
				labels: ['Habitation', 'Alimentation', 'Transport', 'Electricité'],
				legend: {},
			},
			series: [400, 300, 300, 200],
		},
	}),

	methods: {
		...mapActions({
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
			retrieveAccounts: 'accounts/retrieveAccounts', // Récupère la liste des comptes dans le store
			refreshAccounts: 'accounts/refreshAccounts', // Rafraichit la liste des comptes dans le store
		}),

		// Partie CRUD des comptes
		/**
		 * Affiche le compte
		 */
		viewAccount(accountId) {
			console.log('(View) Compte : ' + accountId);
		},
		/**
		 * Supprime le compte
		 */
		deleteAccount(accountId) {
			console.log('(Delete) Compte : ' + accountId);
		},
	},

	computed: {
		...mapGetters({
			// Partie utilisateur
			user: 'auth/getUser',

			// Partie comptes
			isAccountsRetrieving: 'accounts/getIsAccountsRetrieving',
			accounts: 'accounts/getAccounts',

			isEditModal: 'accounts/getEditModal',
		}),

		/*
		 * Les en-têtes du tableau de la liste des comptes
		 */
		headers() {
			return [
				{ text: 'Nom du compte', align: 'start', value: 'name' },
				{ text: 'Etablissement', value: 'establishment' },
				{ text: 'Catégorie', value: 'category' },
				{ text: 'Solde', value: 'balance', sortable: false },
				{ text: '', value: 'actions', align: 'end', sortable: false },
			];
		},
	},

	mounted() {
		// Au chargement de la page, on lance la récupération des comptes dans le store.
		try {
			this.retrieveAccounts(this.user.id);
		} catch (error) {
			this.showSnackbar({ name: 'alertAccountsRetrievingError' });
		}
	},
};
</script>

<style src="./Account.scss" lang="scss" />
