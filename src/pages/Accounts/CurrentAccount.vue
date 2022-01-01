<template>
	<v-container fluid>
		<!-- 
			La page suit la logique suivante: 
			- Quand on arrive sur la page, on teste si des comptes mensuels existent.
			- Si non, alors
				* On affiche le composant CardIfEmpty qui permet de créer une année de compte mensuel
			- Si oui, alors
				* On lance la récupération des comptes mensuels du compte courant.
				* On test si la récupération des comptes mensuels est toujours en cours:
				- Si oui, alors
					* On affiche que les comptes mensuels sont en cours de récupération
				- Si non, alors
					* On teste si l'utilisateur a demandé d'afficher l'ensemble des comptes mensuels
					- Si oui, alors on affiche les différents comptes mensuels
					- Si non, alors on affiche la page du compte mensuel
		-->

		<!-- Partie si le compte courant ne possède aucun compte mensuel -->
		<div v-if="account.monthlyAccounts.length == 0" class="account-page">
			<v-row class="d-flex justify-center mt-10 mb-1">
				<v-col cols="12">
					<div class="d-flex justify-center">
						<CardAddMonthlyAccount v-bind:account="account" empty />
					</div>
				</v-col>
			</v-row>
		</div>

		<!-- Partie si le compte courant possède des comptes mensuels mais qu'ils sont en cours de récupération -->
		<div v-else-if="monthlyAccountsRetrieving">
			<p>Les comptes mensuels sont en cours de récupération.</p>
		</div>

		<!-- Partie si l'utilisateur a demandé d'afficher l'ensemble des comptes mensuels -->
		<div v-else-if="monthlyAccountsDisplaying || !selectedMonthlyAccount.id" class="account-page">
			<!-- Partie titre et sous-titre -->
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-1">
				<h1 class="page-title">Comptes mensuels</h1>
				<div>
					<v-dialog v-model="dialogAddMonthlyAccount" transition="dialog-bottom-transition" max-width="290">
						<template v-slot:activator="{ on, attrs }">
							<v-btn v-on="on" v-bind="attrs" color="primary" class="text-capitalize button-shadow mr-4">Ajouter une année</v-btn>
						</template>
						<CardAddMonthlyAccount v-bind:account="account" v-model="dialogAddMonthlyAccount" v-bind:empty="false" />
					</v-dialog>
					<v-btn color="secondary" class="text-capitalize button-shadow mr-1" @click="monthlyAccountsDisplaying = false">Retour</v-btn>
				</div>
			</v-row>
			<v-row align="center" justify="center" class="fill-height overflow-auto">
				<v-col v-for="item in monthlyAccounts" :key="item.id" :cols="itemsPerRow" class="py-2">
					<v-hover v-slot="{ hover }">
						<v-card
							class="fill-height"
							:elevation="hover ? 16 : 2"
							:class="{ 'on-hover': hover }"
							max-width="300"
							:color="getCardColor(item.state)"
							:shaped="item.state === 'current' ? true : false"
							:outlined="item.state === 'current' ? true : false"
						>
							<v-img :src="require(`../../assets/images/card_${item.month + 1}.jpg`)" width="100%" height="200"></v-img>
							<v-card-title>
								<span class="font-weight-light text-truncate"> {{ (item.month + 1) | formatMonth }} {{ item.year }} </span>
							</v-card-title>
							<v-card-subtitle>
								<span v-if="item.state == 'close'">Ce compte mensuel est fermé</span>
								<span v-else-if="item.state == 'open'">Ce compte mensuel est ouvert</span>
								<span v-else-if="item.state == 'upcoming'">Ce compte mensuel est à venir</span>
								<span v-else-if="item.state == 'current'">Ce compte mensuel est en cours</span>
							</v-card-subtitle>
							<v-divider></v-divider>
							<v-card-text>
								<v-row justify="space-around">
									<v-chip class="mx-2 my-auto" color="green" text-color="white">
										<v-avatar left class="green darken-4"> {{ item.currentAccountOperations.length }} </v-avatar>
										Opérations
									</v-chip>
									<v-btn class="ma-2" fab small dark color="teal" @click="openMonthlyAccount(item)">
										<v-icon dark>mdi-eye</v-icon>
									</v-btn>
								</v-row>
							</v-card-text>
						</v-card>
					</v-hover>
				</v-col>
			</v-row>
		</div>

		<!-- Partie "normale" où on affiche toutes les informations du compte mensuel -->
		<div v-else class="account-page">
			<!-- Partie titre -->
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-1">
				<h1 class="page-title">Compte de {{ selectedMonthlyAccount.month }} {{ selectedMonthlyAccount.year }}</h1>
				<div>
					<v-btn color="primary" class="text-capitalize button-shadow mr-4" @click="monthlyAccountsDisplaying = true">Changer de mois</v-btn>
					<v-btn color="secondary" class="text-capitalize button-shadow mr-1">Configuration</v-btn>
				</div>
			</v-row>

			<!-- Le switch pour changer l'état à 'en cours' du compte mensuel -->
			<v-row no gutters class="d-flex justify-start ml-5">
				<v-switch
					v-model="currentSwitch"
					:disabled="currentSwitchDisabled"
					@change="changeCurrentMonthlyAccount()"
					color="success"
					:label="currentSwitch ? currentSwitchTextOn : currentSwitchTextOff"
				/>
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
								<!-- <v-btn color="secondary" class="text-capitalize button-shadow mr-1">Nouvelle opération</v-btn> -->
								<DialogCreateOperation v-bind:monthlyAccountId="selectedMonthlyAccount.id" />
							</div>
						</v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<v-skeleton-loader v-if="isOperationsRetrieving" type="table"></v-skeleton-loader>
							<v-data-table v-else disable-pagination hide-default-footer :headers="headers" :items="operations" item-key="id">
								<!-- Affichage de la date avec un format plus lisible -->
								<template v-slot:[`item.dateOp`]="{ item }">
									{{ new Date(item.dateOp).toLocaleDateString('fr-FR') }}
								</template>

								<!-- Affichage de la catégory de l'opération -->
								<template v-slot:[`item.category`]="{ item }">
									{{ displayOperationCategory(item.category) }}
								</template>

								<!-- Affichage des crédits et débit dans un format plus user friendly -->
								<template v-slot:[`item.debit`]="{ item }">
									{{ item.debit == 0 ? '' : item.debit | formatCurrencyNumber }}
								</template>
								<template v-slot:[`item.credit`]="{ item }">
									{{ item.credit == 0 ? '' : item.credit | formatCurrencyNumber }}
								</template>

								<!-- Affichage du boolean pointée en case à cocher -->
								<template v-slot:[`item.checked`]="{ item }">
									<v-hover v-slot="{ hover }">
										<v-icon small @click="changeOperationStatus(item)" :color="hover ? 'blue' : item.checked ? 'green' : 'red'">
											{{ item.checked ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
										</v-icon>
									</v-hover>
								</template>

								<template v-slot:[`item.actions`]="{ item }">
									<v-row class="d-flex justify-end mr-2">
										<!-- Partie édition du compte -->
										<div>
											<DialogEditOperation v-bind:item="item" />
										</div>

										<!-- Partie suppression du compte -->
										<div>
											<DialogDeleteOperation v-bind:item="item" />
										</div>
									</v-row>
								</template>
							</v-data-table>
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
import CardAddMonthlyAccount from '../../components/accounts/monthly-account/CardAddMonthlyAccount';
import DialogCreateOperation from '../../components/accounts/monthly-account/DialogCreateOperation.vue';
import DialogEditOperation from '../../components/accounts/monthly-account/DialogEditOperation.vue';
import DialogDeleteOperation from '../../components/accounts/monthly-account/DialogDeleteOperation.vue';
import config from '../../config/index';
import formAccountHelper from '../../config/formAccountHelper';

export default {
	name: 'CurrentAccount',

	metaInfo: {
		title: 'Comptes',
	},

	components: {
		ApexChart,
		CardAddMonthlyAccount,
		DialogCreateOperation,
		DialogEditOperation,
		DialogDeleteOperation,
	},

	data() {
		return {
			// Etat pour savoir si l'utilisateur a demandé l'affichage des comptes mensuels.
			monthlyAccountsDisplaying: false,
			dialogAddMonthlyAccount: false,

			// Partie switch du compte mensuel en cours ou non
			currentSwitch: false,
			currentSwitchDisabled: false,
			currentSwitchTextOn: 'Compte mensuel en cours',
			currentSwitchTextOff: 'Définir comme le compte mensuel en cours',

			apexLoading: true,

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
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
			retrieveMonthlyAccounts: 'accountDetails/retrieveMonthlyAccounts', // Télécharge tous les comptes mensuels dans le store
			changeCurrentMonthlyAccountInStore: 'accountDetails/changeCurrentMonthlyAccount', // Change le compte mensuels visualisé comme le current
			changeSelectedMonthlyAccountInStore: 'accountDetails/changeSelectedMonthlyAccount', // Change le compte mensuels visualisé comme le current
		}),

		/**
		 * Onvre le compte mensuel sélectionné.
		 */
		openMonthlyAccount(monthlyAccount) {
			if (monthlyAccount.state === 'current') {
				// Si le mois qu'on ouvre est un mois 'current'
				this.currentSwitch = true; // On replace à true le switch
				this.currentSwitchDisabled = true; // On replace à true l'état disable du switch
			} else {
				this.currentSwitch = false; // On replace à false le switch
				this.currentSwitchDisabled = false; // On replace à false l'état disable du switch
			}
			this.changeSelectedMonthlyAccountInStore(monthlyAccount);
			this.monthlyAccountsDisplaying = false; // On ferme cette "vue" pour aller dans la vue "normale"
		},

		/**
		 * Change le compte mensuel affiché comme le compte mensuel en cours.
		 * Attention, une fois que le compte mensuel est passé à 'en cours', on ne peut plus changer son état.
		 * Il faut changer de compte mensuel et allé sur un autre pour modifier ça.
		 */
		changeCurrentMonthlyAccount() {
			// Si l'utilisateur passe le switch à true alors, on change le compte mensuel à l'état 'en cours'
			if (this.currentSwitch) {
				this.currentSwitchDisabled = true; // On inactive le switch
				this.changeCurrentMonthlyAccountInStore(); // On modifie l'état dans le store.
				this.showSnackbar({ name: 'alertMACurrent' });
			}
		},

		/** 
		 * Permet de définir la couleur de la carte du compte mensuel
		 */
		getCardColor(state) {
			switch (state) {
				case 'open':
					return 'light-blue lighten-4';
				case 'close':
					return 'blue-grey lighten-4';
				case 'current':
					return 'green lighten-4';
				case 'upcoming':
					return 'deep-orange lighten-4';

				default:
					return 'white';
			}
		},

		/**
		 * Switch sur l'état checked de l'opération
		 */
		changeOperationStatus(item) {
			item.checked = !item.checked;
			const operation = { ...item };
			operation.debit = operation.debit.toString();
			operation.credit = operation.credit.toString();
			// OperationsDataService.update(operation.id, operation).catch((e) => {
			// 	console.log('error : ' + e);
			// });
		},

		/**
		 * Affiche le texte de la catégorie
		 */
		displayOperationCategory(categoryValue) {
			const category = formAccountHelper.formOperationSelect.categories.find(({ value }) => value === categoryValue);
			if (category) return category.text;
			return ''; 
		}
	},

	computed: {
		...mapGetters({
			account: 'accountDetails/getAccountSelected', // Récupère le compte depuis le store
			monthlyAccountsRetrieving: 'accountDetails/isMonthlyAccountsRetrieving', // Récupère l'état de la récupération des comptes mensuels
			monthlyAccounts: 'accountDetails/getMonthlyAccounts', // Récupère tous les comptes mensuels du compte depuis le store
			selectedMonthlyAccount: 'accountDetails/getSelectedMonthlyAccount', // Récupère le compte mensuel en cours depuis le store
			isOperationsRetrieving: 'currentAccountOperation/isOperationsRetrieving', // Récupère l'état de la récupération des opérations
			operations: 'currentAccountOperation/getOperations', // Récupère les opérations du compte mensuel sélectionné
		}),

		/**
		 * Les en-têtes du tableau des opérations
		 */
		headers() {
			return [
				{ text: "Date de l'opération", align: 'start', value: 'dateOp' },
				{ text: 'Catégorie', sortable: false, value: 'category' },
				{ text: 'Libellé', sortable: false, value: 'description' },
				{ text: 'Débit', sortable: false, value: 'debit' },
				{ text: 'Crédit', sortable: false, value: 'credit' },
				{ text: 'Pointée ?', sortable: false, value: 'checked' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
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

	watch: {
		'selectedMonthlyAccount.state': function (val) {
			if (val === 'current') {
				this.currentSwitchDisabled = true; // On inactive le switch
				this.currentSwitch = true; // On passe le switch à true
			}
		},
	},

	mounted: function () {
		this.retrieveMonthlyAccounts();
		if (this.selectedMonthlyAccount.state && this.selectedMonthlyAccount.state === 'current') {
			this.currentSwitch = true;
			this.currentSwitchDisabled = true;
		}
	},
};
</script>

<style src="./Accounts.scss" lang="scss" />
