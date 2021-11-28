<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<v-card>
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
								<th>Totals</th>
								<th></th>
								<th></th>
								<th>{{ sumFields('debit') }}</th>
								<th>{{ sumFields('credit') }}</th>
								<th></th>
								<th></th>
							</tr>
						</template>
					</v-data-table>
				</v-card-text>
			</v-card>
		</v-row>
		<v-row class="mt-3 mb-3">
			<v-divider></v-divider>
		</v-row>
		<v-row align="center" justify="center">
			<v-card>
				<v-card-title>Opérations périodiques</v-card-title>
				<v-card-text>
					<div class="font-weight-bold ml-8 mb-2">Today</div>
					<v-timeline align-top dense>
						<v-timeline-item v-for="operation in periodicOperations" :key="operation.id" color="purple" small>
							<div>
								<div class="font-weight-normal">
									<strong>{{ operation.dayOfMonth }}</strong> @{{ operation.category }}
								</div>
								<div>
									{{ operation.description }}
									<v-icon small class="mr-2" @click="addPeriodicOperation(operation)">mdi-plus</v-icon>
								</div>
							</div>
						</v-timeline-item>
					</v-timeline>
				</v-card-text>
			</v-card>
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
	}),

	methods: {
		retrieveOperations() {
			OperationsDataService.getAll(this.ma.id)
				.then((response) => {
					this.operations = response.data['hydra:member'].map(this.getDisplayOperation);
				})
				.catch((e) => {
					console.log(e);
				});
		},

		retrievePeriodicOperations() {
			PeriodicOperationsDataService.getAll(this.user.id)
				.then((response) => {
					this.periodicOperations = response.data['hydra:member'].map(this.getDisplayPeriodicOperation);
				})
				.catch((e) => {
					console.log(e);
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
			newOperation.dateOp = new Date(this.ma.year, this.ma.month-1, periodicOperation.dayOfMonth+1).toISOString().substr(0, 10);
			newOperation.category = periodicOperation.category;
			newOperation.description = periodicOperation.description;
			newOperation.credit = periodicOperation.credit;
			newOperation.debit = periodicOperation.debit;
			newOperation.checked = false;
			newOperation.monthlyAccount = '/api/monthly_accounts/' + this.ma.id;
			return newOperation;
		},

		sumFields(key) {
			return this.operations.reduce((a, b) => a + (b[key] || 0), 0);
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
