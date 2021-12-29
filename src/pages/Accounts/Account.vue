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
							<v-dialog v-model="dialogCreateAccount" persistent max-width="290">
								<template v-slot:activator="{ on, attrs }">
									<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">
										<v-icon class="mr-2">mdi-plus</v-icon>
										Nouveau compte
									</v-btn>
								</template>
								<v-card>
									<v-card-title>Création d'un compte</v-card-title>
									<v-card-text>
										<v-row>
											<v-col cols="12">
												<v-text-field v-model="formCreateAccount.name" :rules="formBankRules" label="Nom du compte" required></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-text-field v-model="formCreateAccount.establishment" :rules="formBankRules" label="Etablissement" required></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-text-field v-model="formCreateAccount.category" :rules="formBankRules" label="Type de compte" required></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-menu
													ref="menuCreate"
													v-model="menuCreateDatePicker"
													:close-on-content-click="false"
													:return-value.sync="formCreateAccount.createAt"
													transition="scale-transition"
													offset-y
													min-width="auto"
												>
													<template v-slot:activator="{ on, attrs }">
														<v-text-field
															v-model="formCreateAccount.createAt"
															label="Choisissez une date"
															prepend-icon="mdi-calendar"
															readonly
															v-bind="attrs"
															v-on="on"
														></v-text-field>
													</template>
													<v-date-picker v-model="formCreateAccount.createAt" no-title scrollable>
														<v-spacer></v-spacer>
														<v-btn text color="primary" @click="menuDatePicker = false"> Cancel </v-btn>
														<v-btn text color="primary" @click="$refs.menuCreate.save(formCreateAccount.createAt)"> OK </v-btn>
													</v-date-picker>
												</v-menu>
											</v-col>
										</v-row>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn @click="dialogCreateAccount = false">Annuler</v-btn>
										<v-btn @click="createAccount()">Créer</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<v-skeleton-loader v-if="isAccountsRetrieving" type="table"></v-skeleton-loader>
							<v-data-table v-else disable-pagination hide-default-footer :headers="headers" :items="accounts" item-key="id">
								<template v-slot:[`item.actions`]="{ item }">
									<!-- Partie visualisation du compte -->
									<v-tooltip bottom color="primary">
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" @click="viewAccount(item.id)" fab outlined elevation="2" small class="mx-2" color="primary">
												<v-icon>mdi-eye</v-icon>
											</v-btn>
										</template>
										<span>Visualiser</span>
									</v-tooltip>

									<!-- Partie édition du compte -->
									<v-dialog v-model="dialogEditAccount[item.id]" :key="item.id + 'editKey'" persistent max-width="290">
										<template #activator="dialogEditActivator">
											<v-tooltip bottom color="warning">
												<template #activator="tooltipEditActivator">
													<v-btn
														v-on="{ ...dialogEditActivator.on, ...tooltipEditActivator.on }"
														@click.stop="
															$set(dialogEditAccount, item.id, true);
															editAccount(item.id);
														"
														fab
														outlined
														elevation="2"
														small
														class="mx-2"
														color="warning"
													>
														<v-icon>mdi-pencil</v-icon>
													</v-btn>
												</template>
												<span>Supprimer</span>
											</v-tooltip>
										</template>
										<v-card>
											<v-card-title>Mon titre</v-card-title>
											<v-card-text>Mon super text</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn @click="$set(dialogEditAccount, item.id, false)">Fermer</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>

									<!-- Partie suppression du compte -->
									<v-dialog v-model="dialogDeleteAccount[item.id]" :key="item.id + 'deleteKey'" persistent max-width="290">
										<template #activator="dialogDeleteActivator">
											<v-tooltip bottom color="error">
												<template #activator="tooltipDeleteActivator">
													<v-btn
														v-on="{ ...dialogDeleteActivator.on, ...tooltipDeleteActivator.on }"
														@click.stop="
															$set(dialogDeleteAccount, item.id, true);
															deleteAccount(item.id);
														"
														fab
														outlined
														elevation="2"
														small
														class="mx-2"
														color="error"
													>
														<v-icon>mdi-delete</v-icon>
													</v-btn>
												</template>
												<span>Supprimer</span>
											</v-tooltip>
										</template>
										<v-card>
											<v-card-title>Mon titre</v-card-title>
											<v-card-text>Mon super text</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn @click="$set(dialogDeleteAccount, item.id, false)">Fermer</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
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

import config from '../../config/index';

import ApexChart from 'vue-apexcharts';

export default {
	name: 'Account',

	metaInfo: {
		title: 'Comptes',
	},

	components: { ApexChart },

	data: () => ({
		apexLoading: true,

		// Partie fenêtre modale des comptes
		dialogCreateAccount: false,
		dialogEditAccount: {}, // Objet, car sinon la fenêtre modale s'affiche plusieurs fois quand elle est imbriquée dans un tableau.
		dialogDeleteAccount: {},

		// Partie Rules
		formBankRules: [(v) => !!v || 'La banque est obligatoire'],

		// Partie création d'un compte
		formCreateAccount: {
			name: '',
			createAt: null,
			category: '',
			establishment: '',
			authorId: '',
		},
		menuCreateDatePicker: false,

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
			createAccountInStore: 'accounts/createAccount', // Envoie la création d'un compte dans le store et lance le rafraichissement de la liste des comptes.
		}),

		// Partie CRUD des comptes
		/**
		 * Création d'un compte
		 */
		createAccount() {
			this.dialogCreateAccount = false; // On peut fermer la fenêtre modale
			this.formCreateAccount.authorId = this.user.id; // On définit l'utilisateur propriétaire du compte

			this.createAccountInStore(this.formCreateAccount); // On lance la création du compte en l'envoyant à l'API.
		},
		/**
		 * Affiche le compte
		 */
		viewAccount(accountId) {
			console.log('(View) Compte : ' + accountId);
		},
		/**
		 * Modifie le compte
		 */
		editAccount(accountId) {
			console.log('(Edit) Compte : ' + accountId);
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
