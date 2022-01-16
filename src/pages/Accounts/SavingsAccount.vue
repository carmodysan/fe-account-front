<template>
	<v-container fluid>
		<!-- Partie configuration des taux d'intérêts -->
		<div v-if="isConfigurationView">
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-1">
				<h1 class="page-title">Taux d'intérêts</h1>
				<div>
					<DialogCreateInterestRate v-bind:savingsAccountId="account.id" />
					<v-btn @click="isConfigurationView = false" color="secondary" class="text-capitalize button-shadow mr-1">Retour</v-btn>
				</div>
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-skeleton-loader v-if="isInterestRatesRetrieving" type="table"></v-skeleton-loader>
					<v-data-table v-else disable-pagination hide-default-footer :headers="headersInterestRate" :items="interestRates" item-key="id">
						<!-- Affichage des taux d'intérêts dans un format plus user friendly -->
						<template v-slot:[`item.rate`]="{ item }"> {{ item.rate }} % </template>

						<!-- Affichage de la date avec un format plus lisible -->
						<template v-slot:[`item.startDate`]="{ item }">
							{{ new Date(item.startDate).toLocaleDateString('fr-FR') }}
						</template>
						<template v-slot:[`item.endDate`]="{ item }">
							{{ new Date(item.endDate).toLocaleDateString('fr-FR') == '31/12/2099' ? 'En cours' : new Date(item.endDate).toLocaleDateString('fr-FR') }}
						</template>

						<template v-slot:[`item.actions`]="{ item }">
							<v-row class="d-flex justify-end mr-2">
								<!-- Partie édition du compte -->
								<div>
									<DialogEditInterestRate v-bind:item="item" />
								</div>

								<!-- Partie suppression du compte -->
								<div>
									<DialogDeleteInterestRate v-bind:item="item" />
								</div>
							</v-row>
						</template>
					</v-data-table>
				</v-col>
			</v-row>
		</div>
		<!-- Partie affiche opérations du compte d'épargne -->
		<div v-else>
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-1">
				<h1 class="page-title">{{ account.name }}</h1>
				<v-btn @click="isConfigurationView = true" color="secondary" class="text-capitalize button-shadow mr-1">Configuration</v-btn>
			</v-row>
			<v-row>
				<!-- Partie Totaux -->
				<v-col lg="3" sm="6" md="5" cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Soldes</p></v-card-title>
						<v-card-text class="pa-6 pt-0">
							<v-row no-gutters class="pb-5" align="center">
								<v-col cols="5" class="my-auto d-flex align-center">
									<span class="font-weight-medium card-dark-grey" style="font-size: 24px">{{ account.balance | formatCurrencyNumber }}</span>
								</v-col>
							</v-row>
							<v-row no-gutters class="justify-space-between">
								<div>
									<div class="subtext">Taux d'intérêt actuel<v-icon color="error"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">{{ actualInterestRate }} %</div>
								</div>
								<div>
									<div class="subtext">Intérêts en cours<v-icon color="success"> mdi-arrow-bottom-right</v-icon></div>
									<div class="subtext-index">{{ account.pendingCumulativeInterest | formatCurrencyNumber }}</div>
								</div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- Partie liste des opérations -->
				<v-col cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6">
							<p>Liste des opérations</p>
							<v-spacer></v-spacer>
							<DialogCreateOperation v-bind:savingsAccountId="account.id" />
						</v-card-title>
						<v-card-text>
							<v-skeleton-loader v-if="isOperationsRetrieving" type="table"></v-skeleton-loader>
							<v-data-table v-else disable-pagination hide-default-footer :headers="headersOperations" :items="operations" item-key="id">
								<!-- Affichage de la date avec un format plus lisible -->
								<template v-slot:[`item.dateOp`]="{ item }">
									{{ new Date(item.dateOp).toLocaleDateString('fr-FR') }}
								</template>

								<!-- Affichage des crédits et débit dans un format plus user friendly -->
								<template v-slot:[`item.debit`]="{ item }">
									{{ item.debit == 0 ? '' : item.debit | formatCurrencyNumber }}
								</template>
								<template v-slot:[`item.credit`]="{ item }">
									{{ item.credit == 0 ? '' : item.credit | formatCurrencyNumber }}
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
			</v-row>
		</div>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DialogCreateOperation from '../../components/accounts/savings/DialogCreateOperation.vue';
import DialogEditOperation from '../../components/accounts/savings/DialogEditOperation.vue';
import DialogDeleteOperation from '../../components/accounts/savings/DialogDeleteOperation.vue';
import DialogCreateInterestRate from '../../components/accounts/savings/DialogCreateInterestRate.vue';
import DialogEditInterestRate from '../../components/accounts/savings/DialogEditInterestRate.vue';
import DialogDeleteInterestRate from '../../components/accounts/savings/DialogDeleteInterestRate.vue';

export default {
	name: 'SavingsAccount',

	components: {
		DialogCreateOperation,
		DialogEditOperation,
		DialogDeleteOperation,
		DialogCreateInterestRate,
		DialogEditInterestRate,
		DialogDeleteInterestRate,
	},

	data() {
		return {
			isConfigurationView: false,
		};
	},

	methods: {
		...mapActions({
			retrieveOperations: 'savingsAccountOperation/retrieveOperations', // Télécharge tous les opérations
			retrieveInterestRates: 'interestRate/retrieveInterestRates', // Télécharge tous les taux d'intérêts
		}),
	},

	computed: {
		...mapGetters({
			account: 'accountDetails/getAccountSelected', // Récupère le compte depuis le store
			isOperationsRetrieving: 'savingsAccountOperation/isOperationsRetrieving', // Récupère l'état de la récupération des opérations
			operations: 'savingsAccountOperation/getOperations', // Récupère les opérations du compte d'épargne sélectionné
			isInterestRatesRetrieving: 'interestRate/isInterestRatesRetrieving', // Récupère l'état de la récupération des taux d'intérêts
			interestRates: 'interestRate/getInterestRates', // Récupère les taux d'intérêts du compte d'épargne sélectionné
			actualInterestRate: 'interestRate/getActualInterestRate', // Récupère le taux d'intérêt actuel du compte d'épargne sélectionné
		}),

		/**
		 * Les en-têtes du tableau des opérations
		 */
		headersOperations() {
			return [
				{ text: "Date de l'opération", align: 'start', value: 'dateOp' },
				{ text: 'Débit', sortable: false, value: 'debit' },
				{ text: 'Crédit', sortable: false, value: 'credit' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
		},

		/**
		 * Les en-têtes du tableau des opérations
		 */
		headersInterestRate() {
			return [
				{ text: "Taux d'intérêts", align: 'start', value: 'rate' },
				{ text: 'Date de début', sortable: false, value: 'startDate' },
				{ text: 'Date de fin', sortable: false, value: 'endDate' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
		},
	},

	mounted() {
		this.retrieveOperations(this.account.id);
		this.retrieveInterestRates(this.account.id);
	},
};
</script>
