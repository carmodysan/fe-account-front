<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<div v-if="isOperationsLoading">
				<v-skeleton-loader
					class="mx-auto"
					min-width="300"
					type="card-heading, table"
				></v-skeleton-loader>
			</div>
			<div v-else>
				<v-card class="mb-2">
					<v-card-title>
						<v-row>
							<v-col cols="10">Toutes les opérations du mois</v-col>
							<v-col cols="2"><v-btn :to="{ name: 'operation-add', params: { ma: ma } }"> New </v-btn></v-col>
						</v-row>
					</v-card-title>
					<v-card-text>
						<v-data-table :headers="headers" :items="operations" item-key="id">
							<template v-slot:[`item.actions`]="{ item }">
								<v-icon small class="mr-2" @click="editOperation(item.id)">mdi-pencil</v-icon>
								<v-icon small @click="deleteOperation(item.id)">mdi-delete</v-icon>
							</template>
							<template slot="body.append">
								<tr class="pink--text">
									<th>Total actuel</th>
									<th></th>
									<th></th>
									<th>{{ sumCheckedDebitOperations }}</th>
									<th>{{ sumCheckedCreditOperations }}</th>
									<th>{{ sumDifferenceCheckedOperations }}</th>
									<th></th>
								</tr>
								<tr class="blue--text">
									<th>Total prévisionnel</th>
									<th></th>
									<th></th>
									<th>{{ sumCheckedAndUncheckedOperations('debit') }}</th>
									<th>{{ sumCheckedAndUncheckedOperations('credit') }}</th>
									<th>{{ sumDifferenceCheckedAndUnCheckedOperations() }}</th>
									<th></th>
								</tr>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</div>
		</v-row>
		<v-row>
			<v-divider></v-divider>
		</v-row>
		<v-row align="center" justify="center">
			<div v-if="isPeriodicLoading">
				<v-skeleton-loader
					class="mx-auto"
					min-width="300"
					type="card-heading, list-item-avatar, divider, list-item-avatar, divider, list-item-avatar, divider"
				></v-skeleton-loader>
			</div>
			<div v-else>
				<v-card min-width="300" class="mt-2">
					<v-card-title>Opérations périodiques</v-card-title>
					<v-card-text>
						<div class="font-weight-bold ml-8 mb-2">Today</div>
						<v-timeline align-top dense>
							<v-timeline-item v-for="operation in periodicOperations" :key="operation.id" :color="getColorTimeLine(operation.debit)" small>
								<v-row>
									<v-col cols="10" class="mb-4">
										<v-row>
											<div>
												Le <strong>{{ operation.dayOfMonth }}</strong> du mois -
											</div>
											<div class="ml-1">
												<strong> {{ operation.debit }} € </strong>
											</div>
										</v-row>
										<v-row>
											<strong>{{ operation.category }}</strong> - {{ operation.description }}
										</v-row>
									</v-col>
									<v-col cols="2" class="mb-4 d-flex justify-center">
										<v-row>
											<v-icon small class="mr-2" @click="addPeriodicOperation(operation)">mdi-plus</v-icon>
										</v-row>
									</v-col>
								</v-row>
								<v-divider></v-divider>
							</v-timeline-item>
						</v-timeline>
					</v-card-text>
				</v-card>
			</div>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import OperationsDataService from '../../services/OperationsDataService';
import PeriodicOperationsDataService from '../../services/PeriodicOperationsDataService';
import { mapGetters } from 'vuex';

// TODO Créer des messages d'alerte sur les pages OperationDetails et OperationAdd

export default {
	name: 'operations-list',

	data: () => ({
		ma: {},
		maSlug: '',
		operations: [],
		periodicOperations: [],
		newOperation: {
			dateOp: new Date(Date.now()).toISOString().substr(0, 10),
			category: '',
			description: '',
			credit: '0',
			debit: '0',
			checked: false,
			monthlyAccount: '',
		},
		isPeriodicLoading: true,
		isOperationsLoading: true,
	}),

	methods: {
		retrieveOperations() {
			this.isOperationsLoading = true;
			OperationsDataService.getAll(this.ma.id)
				.then((response) => {
					this.operations = response.data['hydra:member'].map(this.getDisplayOperation);
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.isOperationsLoading = false;
				});
		},

		retrievePeriodicOperations() {
			this.isPeriodicLoading = true;
			PeriodicOperationsDataService.getAll(this.user.id)
				.then((response) => {
					this.periodicOperations = response.data['hydra:member'].map(this.getDisplayPeriodicOperation);
				})
				.catch((e) => {
					console.log(e);
				}).finally(() => {
					this.isPeriodicLoading = false;
				});
		},

		refreshList() {
			this.retrieveOperations();
		},

		editOperation(id) {
			// TODO Vérifier l'utilité du this.maSlug qui pourrait sûrement être enlevé
			this.$router.push({ name: 'operation-details', params: { id: id, ma: this.ma, maSlug: this.maSlug } });
		},

		deleteOperation(id) {
			OperationsDataService.delete(id)
				.then(() => {
					this.refreshList();
				})
				.catch((e) => {
					console.log(e);
				});
		},

		addPeriodicOperation(periodicOperation) {
			const op = this.transferPeriodicOperation(periodicOperation);
			console.log(op);
			OperationsDataService.create(op)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.refreshList();
				});
		},

		getDisplayOperation(operation) {
			return {
				id: operation.id,
				dateOp: operation.dateOp.substr(0, 10),
				category: operation.category.length > 30 ? operation.category.substr(0, 30) + '...' : operation.category,
				description: operation.description.length > 30 ? operation.description.substr(0, 30) + '...' : operation.description,
				credit: operation.credit,
				debit: operation.debit,
				checked: operation.checked,
			};
		},

		getDisplayPeriodicOperation(operation) {
			return {
				id: operation.id,
				dayOfMonth: operation.dayOfMonth,
				category: operation.category.length > 30 ? operation.category.substr(0, 30) + '...' : operation.category,
				description: operation.description.length > 30 ? operation.description.substr(0, 30) + '...' : operation.description,
				credit: operation.credit,
				debit: operation.debit,
			};
		},

		/**
		 * Retourne un objet Operation à partir d'un objet PeriodicOperation
		 */
		transferPeriodicOperation(periodicOperation) {
			let newOperation = {};
			newOperation.dateOp = new Date(this.ma.year, this.ma.month - 1, periodicOperation.dayOfMonth + 1).toISOString().substr(0, 10);
			newOperation.category = periodicOperation.category;
			newOperation.description = periodicOperation.description;
			newOperation.credit = periodicOperation.credit;
			newOperation.debit = periodicOperation.debit;
			newOperation.checked = false;
			newOperation.monthlyAccount = '/api/monthly_accounts/' + this.ma.id;
			return newOperation;
		},

		/**
		 * Somme des opérations de crédit prévisionnelles
		 */
		sumCheckedAndUncheckedOperations(key) {
			return this.operations.reduce((a, b) => a + (b[key] || 0), 0);
		},

		/**
		 * Retourne le montant prévisionnel des opérations cumulées en cours et futures
		 */
		sumDifferenceCheckedAndUnCheckedOperations() {
			return this.sumCheckedAndUncheckedOperations('credit') - this.sumCheckedAndUncheckedOperations('debit');
		},

		/**
		 * Retourne une couleur en fonction du montant de l'opération
		 */
		getColorTimeLine(debit) {
			if (debit < 21) {
				return 'lime lighten-4';
			} else if (debit < 51) {
				return 'lime lighten-1';
			} else if (debit < 81) {
				return 'orange lighten-2';
			} else if (debit < 151) {
				return 'orange darken-1';
			} else if (debit < 201) {
				return 'orange darken-4';
			} else if (debit < 501) {
				return 'red darken-1';
			} else {
				return 'red accent-4';
			}
		},
	},

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),

		headers() {
			return [
				{
					text: "Date de l'opération",
					align: 'start',
					sortable: false,
					value: 'dateOp',
				},
				{ text: 'Catégorie', value: 'category' },
				{ text: 'Libellé', value: 'description' },
				{ text: 'Débit', value: 'debit' },
				{ text: 'Crédit', value: 'credit' },
				{ text: 'Pointée ?', value: 'checked' },
				{ text: 'Actions', value: 'actions' },
			];
		},

		/**
		 * Somme des opérations de crédit pointées
		 */
		sumCheckedCreditOperations: function () {
			let sum = 0;
			this.operations.forEach((element) => {
				if (element.checked) {
					sum += element.credit;
				}
			});
			return sum;
		},

		/**
		 * Somme des opérations de débit pointées
		 */
		sumCheckedDebitOperations: function () {
			let sum = 0;
			this.operations.forEach((element) => {
				if (element.checked) {
					sum += element.debit;
				}
			});
			return sum;
		},

		/**
		 * Retourne le montant actuel des opérations cumulées
		 */
		sumDifferenceCheckedOperations: function () {
			let response = this.sumCheckedCreditOperations - this.sumCheckedDebitOperations;
			return response.toFixed(2);
		},
	},

	mounted() {
		this.retrieveOperations();
		this.retrievePeriodicOperations();
	},

	created() {
		this.ma = this.$route.params.ma;
		this.maSlug = this.$route.params.maSlug;
	},
};
</script>
