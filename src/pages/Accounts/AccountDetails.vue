<template>
	<v-container fluid>
		<div class="account-page">
			<!-- Partie titre et sous-titre -->
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-1">
				<v-row no-gutters class="d-flex">
					<h1 class="page-title">Compte de Janvier 2022</h1>
					<v-btn color="secondary" class="text-capitalize button-shadow ml-5">Revenir sur tous les comptes</v-btn>
				</v-row>
				<div>
					<v-btn color="primary" class="text-capitalize button-shadow mr-4">Changer de mois</v-btn>
					<v-btn color="secondary" class="text-capitalize button-shadow mr-1">Configuration</v-btn>
				</div>
			</v-row>
			<v-row class="ml-10 mb-6">
				<h6>Date d'ouverture le 05 avril 2020</h6>
			</v-row>

			<!-- Partie corps de page -->
			<v-row>
				<!-- Partie Salaire -->
				<v-col lg="3" sm="6" md="5" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Salaires</p></v-card-title>
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
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Epargne</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Bourse</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">Autres</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie Opérations périodiques -->
				<v-col lg="3" sm="6" md="5" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Opérations périodiques</p></v-card-title>
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
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Epargne</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Bourse</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">Autres</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie Totaux -->
				<v-col lg="3" sm="6" md="5" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Soldes</p></v-card-title>
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
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Epargne</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Bourse</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">Autres</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie Dépenses -->
				<v-col lg="3" sm="6" md="5" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Plus grosses dépenses</p></v-card-title>
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
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Epargne</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="success"> mdi-arrow-top-right</v-icon></div>
									<div class="subtext-index">Bourse</div>
								</div>
								<div>
									<div class="subtext">Exemple<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">Autres</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie liste des opérations du mois en cours -->
				<v-col cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6">
							<p>Liste des opérations du mois en cours</p>
							<v-spacer></v-spacer>
							<!-- Partie création d'un compte -->
							<div>
								<v-btn color="primary" class="text-capitalize button-shadow mr-4">Opérations périodiques</v-btn>
								<v-btn color="secondary" class="text-capitalize button-shadow mr-1">Nouvelle opération</v-btn>
							</div>
						</v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<!-- <v-skeleton-loader v-if="isAccountsRetrieving" type="table"></v-skeleton-loader> -->
							<!-- <v-data-table v-else disable-pagination hide-default-footer :headers="headers" :items="accounts" item-key="id"> -->
							<v-data-table disable-pagination hide-default-footer :headers="headers" :items="operations" item-key="id"> </v-data-table>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie clôture du compte mensuel -->
				<v-col cols="12" class="px-10">
					<v-btn color="primary" class="text-capitalize button-shadow" block>Clôturer le mois en cours</v-btn>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ApexChart from 'vue-apexcharts';
import config from '../../config/index';

export default {
	name: 'AccountDetails',

	metaInfo: {
		title: 'Comptes',
	},

	components: {
		ApexChart,
	},

	data() {
		return {
			apexLoading: true,

			operations: [],

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
		};
	},

	methods: {
		...mapActions({
			// retrieveAccountSelected: 'accountDetails/retrieveAccountSelected', // Télécharge le compte dans le store
		}),
	},

	computed: {
		...mapGetters({
			account: 'accountDetails/getAccountSelected', // Récupère le compte depuis le store
		}),

		headers() {
			return [
				{ text: "Date de l'opération", align: 'start', value: 'dateOp' },
				{ text: 'Catégorie', sortable: false, value: 'category' },
				{ text: 'Libellé', sortable: false, value: 'description' },
				{ text: 'Débit', sortable: false, value: 'debit' },
				{ text: 'Crédit', sortable: false, value: 'credit' },
				{ text: 'Pointée ?', sortable: false, value: 'checked' },
				{ text: 'Actions', sortable: false, align: 'end', value: 'actions' },
			];
		},
	},
};
</script>

<style src="./Accounts.scss" lang="scss" />
