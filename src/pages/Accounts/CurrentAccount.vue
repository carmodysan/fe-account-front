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
				<h1 class="page-title">Compte {{ displayMonthText() }} {{ selectedMonthlyAccount.year }}</h1>
				<div>
					<v-btn color="primary" class="text-capitalize button-shadow mr-4" @click="monthlyAccountsDisplaying = true">Changer de mois</v-btn>
					<v-btn color="secondary" class="text-capitalize button-shadow mr-1" :to="{ name: 'PeriodicOperation' }">Configuration</v-btn>
				</div>
			</v-row>

			<!-- Le switch pour changer l'état à 'en cours' du compte mensuel -->
			<v-row no gutters class="d-flex justify-start ml-5">
				<v-switch
					v-if="selectedMonthlyAccount.state != 'close'"
					v-model="currentSwitch"
					:disabled="currentSwitchDisabled"
					@change="changeCurrentMonthlyAccount()"
					color="success"
					:label="currentSwitch ? currentSwitchTextOn : currentSwitchTextOff"
				/>
				<h2 v-else class="page-subtitle">Les comptes de ce mois sont clôturés</h2>
			</v-row>

			<!-- Partie corps de page -->
			<v-row>
				<!-- Partie Salaire -->
				<v-col lg="3" sm="6" md="5" cols="12" v-if="selectedMonthlyAccount.state != 'upcoming'">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Salaires</p></v-card-title>
						<v-card-text class="pa-6 pt-0">
							<v-row>
								<v-col cols="12">
									<ApexChart
										height="210"
										type="donut"
										class="mt-1"
										:options="displaySelectedMonth.apexPieSalaries.options"
										:series="displaySelectedMonth.apexPieSalaries.series"
										parentHeightOffset="0"
									></ApexChart>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie Opérations périodiques -->
				<v-col lg="3" sm="6" md="5" cols="12" v-if="selectedMonthlyAccount.state != 'upcoming'">
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
				<v-col lg="3" sm="6" md="5" cols="12" v-if="selectedMonthlyAccount.state != 'upcoming'">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6">
							<p v-if="selectedMonthlyAccount.state == 'close'">Restant mensuel</p>
							<p v-else>Solde mensuel</p>
						</v-card-title>
						<v-card-text class="pa-6 pt-0">
							<v-row no-gutters class="pb-5" align="center">
								<v-col cols="5" class="my-auto d-flex align-center" style="min-height: 115px">
									<span v-if="selectedMonthlyAccount.state == 'current'" class="font-weight-medium card-dark-grey" style="font-size: 24px">{{
										account.balance | formatCurrencyNumber
									}}</span>
									<span v-else class="font-weight-medium card-dark-grey" style="font-size: 24px">{{ displaySelectedMonth.balance | formatCurrencyNumber }}</span>
								</v-col>
								<v-col cols="7">
									<ApexChart v-if="apexLoading" height="35" type="area" :options="apexArea1.options" :series="apexArea1.series"></ApexChart>
								</v-col>
							</v-row>
							<v-row no-gutters class="justify-space-between">
								<div>
									<div class="subtext">A venir<v-icon color="success"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">{{ account.upcomingBalance | formatCurrencyNumber }}</div>
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
				<v-col lg="3" sm="6" md="5" cols="12" v-if="selectedMonthlyAccount.state != 'upcoming'">
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
							<!-- Partie création d'une opération -->
							<div>
								<input id="fileInput" ref="file" type="file" style="display: none" @change="importOperations" />
								<v-btn @click="$refs.file.click()" class="text-capitalize button-shadow mr-4" v-if="selectedMonthlyAccount.state != 'close'">
									<v-icon class="mr-1">mdi-database-import</v-icon>
								</v-btn>
								<v-btn @click="exportOperations()" class="text-capitalize button-shadow mr-4">
									<v-icon class="mr-1">mdi-database-export</v-icon>
								</v-btn>
								<v-dialog max-width="900" transition="dialog-top-transition" v-if="selectedMonthlyAccount.state != 'close'">
									<template v-slot:activator="{ on, attrs }">
										<v-btn v-on="on" v-bind="attrs" color="primary" class="text-capitalize button-shadow mr-4">
											<v-icon class="mr-1">mdi-book-refresh</v-icon>
											Opérations périodiques
										</v-btn>
									</template>
									<template v-slot:default="dialog">
										<v-card>
											<v-toolbar color="primary" dark>Ajouter une opération périodique</v-toolbar>
											<v-card-text>
												<div class="mt-5">
													<TablePeriodicOperation v-bind:config="false" v-model="dialog.value" />
												</div>
											</v-card-text>
											<v-card-actions class="justify-end">
												<v-btn @click="dialog.value = false" color="secondary" class="text-capitalize button-shadow">Fermer</v-btn>
											</v-card-actions>
										</v-card>
									</template>
								</v-dialog>
								<DialogCreateOperation v-bind:monthlyAccountId="selectedMonthlyAccount.id" v-if="selectedMonthlyAccount.state != 'close'" />
							</div>
						</v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<v-skeleton-loader v-if="isOperationsRetrieving" type="table"></v-skeleton-loader>
							<v-data-table
								v-else
								disable-pagination
								hide-default-footer
								:headers="headers"
								:items="operations"
								:sort-by.sync="columnName"
								:sort-desc.sync="isDescending"
								item-key="id"
							>
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
										<v-icon
											v-if="selectedMonthlyAccount.state != 'close'"
											small
											@click="changeOperationStatus(item)"
											:color="hover ? 'blue' : item.checked ? 'green' : 'red'"
										>
											{{ item.checked ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
										</v-icon>
										<v-icon v-else small color="grey">
											{{ item.checked ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
										</v-icon>
									</v-hover>
								</template>

								<!-- Affichage de l'opération périodique quand c'en est une -->
								<template v-slot:[`item.periodic`]="{ item }">
									<v-chip v-if="item.fromPeriodic" outlined><v-icon left>mdi-book-refresh</v-icon>périodique</v-chip>
								</template>

								<template v-slot:[`item.actions`]="{ item }">
									<v-row class="d-flex justify-end mr-2">
										<!-- Partie édition du compte -->
										<div v-if="selectedMonthlyAccount.state != 'close'">
											<DialogEditOperation v-bind:item="item" />
										</div>

										<!-- Partie suppression du compte -->
										<div v-if="selectedMonthlyAccount.state != 'close'">
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
					<v-btn v-if="selectedMonthlyAccount.state != 'close'" color="primary" class="text-capitalize button-shadow" @click="closeSelectedMonth()" block>
						Clôturer le mois en cours</v-btn
					>
				</v-col>

				<!-- Bouton scroll back to top -->
				<v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="primary" @click="toTop"><v-icon>mdi-menu-up</v-icon> </v-btn>
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
import TablePeriodicOperation from '../../components/accounts/TablePeriodicOperation';
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
		TablePeriodicOperation,
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
			fab: false, // Bouton scroll back to top
			isDescending: true, // Colonne date opération toujours triée
			columnName: 'dateOp', // Colonne date opération toujours triée

			// Partie affichage des totaux et autres statistiques du haut de page
			displaySelectedMonth: {
				balance: 0,
				apexPieSalaries: {
					options: {
						dataLabels: {
							enabled: false,
						},
						colors: [config.color.light.primary, config.color.light.secondary],
						labels: ['Salaire 1', 'Salaire 2'],
						legend: {
							position: 'bottom',
						},
					},
					series: [100, 100],
				},
				sumSalaries: 0,
			},

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
			closeSelectedMonthlyAccountInStore: 'accountDetails/closeSelectedMonthlyAccount', // Clôture le compte sélectionné
			editOperationInStore: 'currentAccountOperation/editOperation', // Modifie l'opération dans le store
			createOperationInStore: 'currentAccountOperation/createOperation', // Envoie la création d'une opération
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
			this.updateAllUpPageStatistique();
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
			this.editOperationInStore(operation);
		},

		/**
		 * Affiche le texte de la catégorie
		 */
		displayOperationCategory(categoryValue) {
			const category = formAccountHelper.formOperationSelect.categories.find(({ value }) => value === categoryValue);
			if (category) return category.text;
			return '';
		},

		itemRowBackground: function (item) {
			return item.fromPeriodic ? 'fromPeriodicRow' : 'classicRow';
		},

		/**
		 * Exporte toutes les opérations du mois en cours
		 */
		exportOperations() {
			const data = JSON.stringify(this.operations, null, 2);
			let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
			let exportFileDefaultName = 'data.json';
			let linkElement = document.createElement('a');
			linkElement.setAttribute('href', dataUri);
			linkElement.setAttribute('download', exportFileDefaultName);
			linkElement.click();
		},

		/**
		 * Importe des opérations dans le mois en cours
		 */
		importOperations(event) {
			let file = event.target.files[0];
			const reader = new FileReader();
			if (file.name.includes('.json')) {
				reader.onload = (res) => {
					let resultReader = res.target.result;
					let operation = {}; // Création d'une opération vierge

					let obj = JSON.parse(resultReader); // On parse en JSON le résultat
					for (let i = 0; i < obj.length; i++) {
						// Pour chaque opération, on récupère tous les éléments nécessaires à la création
						console.log(obj[i].dateOp);
						operation.category = obj[i].category;
						operation.checked = obj[i].checked;
						operation.credit = obj[i].credit;
						operation.debit = obj[i].debit;
						operation.dateOp = obj[i].dateOp;
						operation.description = obj[i].description;
						operation.fromPeriodic = obj[i].fromPeriodic;
						operation.monthlyAccount = '/api/monthly_accounts/' + this.selectedMonthlyAccount.id; // On ajoute l'identifiant

						this.createOperationInStore({ operation: operation, monthlyAccountId: this.selectedMonthlyAccount.id }); // On lance la création depuis le store
					}
				};
				reader.onerror = (err) => console.log(err);
				reader.readAsText(file);
			}
		},

		/**
		 * Fonction onScroll et toTop pour le bouton Scroll back to top
		 */
		onScroll(e) {
			if (typeof window === 'undefined') return;
			const top = window.pageYOffset || e.target.scrollTop || 0;
			this.fab = top > 20;
		},
		toTop() {
			this.$vuetify.goTo(0);
		},

		/**
		 * Affichage en mode texte du mois du compte courant en cours
		 */
		displayMonthText() {
			switch (this.selectedMonthlyAccount.month) {
				case 0:
					return 'de janvier';
				case 1:
					return 'de février';
				case 2:
					return 'de mars';
				case 3:
					return "d'avril";
				case 4:
					return 'de mai';
				case 5:
					return 'de juin';
				case 6:
					return 'de juillet';
				case 7:
					return "d'aout";
				case 8:
					return 'de septembre';
				case 9:
					return "d'octobre";
				case 10:
					return 'de novembre';
				case 11:
					return 'de décembre';
				default:
					break;
			}
			return ''; // Par défaut on ne retourne rien
		},

		/**
		 * ------------------------------ Partie statistique ------------------------------
		 */
		/**
		 * Permet de mettre à jour toutes les statistiques du haut de la page (salaire, solde, etc.)
		 */
		updateAllUpPageStatistique() {
			this.calculateBalanceSelectedMonth();
			this.retrievingSalaries();
		},

		/**
		 * Calcul le solde du mois sélectionné
		 */
		calculateBalanceSelectedMonth() {
			let balance = this.operations.reduce((a, b) => a + ((b['checked'] ? b['credit'] - b['debit'] : 0) || 0), 0);
			this.displaySelectedMonth.balance = balance;
		},

		/**
		 * Récupération des salaires. Se base sur le principe qu'il n'y a que deux salaires.
		 * Cela pourrait être amélioré...
		 */
		retrievingSalaries() {
			let salaries = this.operations.filter((item) => item.category == 'Job' && item.description.includes('Salaire'));

			if (salaries.length == 2) {
				// Pour ne pas avoir d'errreur dans la lecture du tableau salaries.
				this.displaySelectedMonth.apexPieSalaries = {
					options: {
						dataLabels: {
							enabled: false,
						},
						colors: [config.color.light.primary, config.color.light.secondary],
						labels: [salaries[0].description.toString().split(' ')[1], salaries[1].description.toString().split(' ')[1]],
						legend: {
							position: 'bottom',
							formatter: function (val, opts) {
								return val + ' - ' + opts.w.globals.series[opts.seriesIndex] + ' €';
							},
						},
						plotOptions: {
							pie: {
								donut: {
									labels: {
										show: true,
										value: {
											show: true,
											fontWeight: 700,
										},
										total: {
											show: true,
											fontWeight: 600,
											label: 'Total',
											color: '#373d3f',
											formatter: function (w) {
												return (
													w.globals.seriesTotals.reduce((a, b) => {
														return a + b;
													}, 0) + ' €'
												);
											},
										},
									},
								},
							},
						},
						fill: {
							type: 'gradient',
						},
					},
					series: [parseFloat(salaries[0].credit), parseFloat(salaries[1].credit)],
				};
				this.displaySelectedMonth.sumSalaries = parseFloat(salaries[0].credit) + parseFloat(salaries[1].credit);
			} else {
				// Affichage par défaut du ApexChart quand on ne trouve pas de salaires
				this.displaySelectedMonth.apexPieSalaries = {
					options: {
						dataLabels: {
							enabled: false,
						},
						colors: [config.color.light.primary, config.color.light.secondary],
						labels: ['Salaire 1', 'Salaire 2'],
						legend: {
							position: 'bottom',
						},
					},
					series: [100, 100],
				};
			}
		},
		/**
		 * ------------------------------ Fin partie statistique ------------------------------
		 */

		/**
		 * Cloture le mois sélectionné
		 */
		closeSelectedMonth() {
			if (this.selectedMonthlyAccount.state == 'open') {
				// On ne peut clôturer qu'un compte ouvert et pas le courant
				this.closeSelectedMonthlyAccountInStore();
				this.toTop();
				this.showSnackbar({ name: 'alertMAClose'});
			}
			else {
				this.showSnackbar({ name: 'alertMACloseError' });
			}
		},
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
				{ text: "Date de l'opération", sortable: false, align: 'start', value: 'dateOp' },
				{ text: 'Catégorie', sortable: false, value: 'category' },
				{ text: 'Libellé', sortable: false, value: 'description' },
				{ text: 'Débit', sortable: false, value: 'debit' },
				{ text: 'Crédit', sortable: false, value: 'credit' },
				{ text: 'Pointée ?', sortable: false, align: 'center', value: 'checked' },
				{ text: '', sortable: false, align: 'center', value: 'periodic' },
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
		isOperationsRetrieving: {
			handler(oldValue, newValue) {
				// On peut mettre un watch sur une computed property.
				if (oldValue == false && newValue == true) {
					// Je ne comprends pas pourquoi cela fonctionne quand isOperationRetrieving nouvelle valeur est à true... (cela devrait être l'inverse)
					this.updateAllUpPageStatistique();
				}
			},
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
