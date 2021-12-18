<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<div v-if="isOperationsLoading">
				<v-skeleton-loader class="mx-auto" min-width="300" type="card-heading, table"></v-skeleton-loader>
			</div>
			<div v-else>
				<v-card class="mb-2">
					<v-card-title>
						<v-row>
							<v-col cols="6">Toutes les opérations du mois</v-col>
							<v-col cols="2">
								<v-dialog v-model="dialog" width="200">
									<template v-slot:activator="{ on, attrs }">
										<v-btn dark v-bind="attrs" v-on="on">Importer</v-btn>
									</template>
									<v-card>
										<v-card-title class="text-h5 grey lighten-2"> Sélectionner un fichier </v-card-title>
										<v-card-text>
											<v-file-input truncate-length="15" @change="selectFile"></v-file-input>
										</v-card-text>
										<v-divider></v-divider>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn color="primary" text @click="importData()">Upload</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
							</v-col>
							<v-col cols="2"><v-btn @click="exportData()">Exporter</v-btn></v-col>
							<v-col cols="2"><v-btn :to="{ name: 'operation-add', params: { ma: ma } }"> New </v-btn></v-col>
						</v-row>
					</v-card-title>
					<v-card-text>
						<v-data-table :headers="headers" :items="operations" item-key="id" hide-default-footer disable-pagination>
							<template v-slot:[`item.dateOp`]="{ item }">
								{{ new Date(item.dateOp).toLocaleDateString('fr-FR') }}
							</template>
							<template v-slot:[`item.debit`]="{ item }">
								{{ item.debit == 0 ? '' : item.debit | formatCurrencyNumber }}
							</template>
							<template v-slot:[`item.credit`]="{ item }">
								{{ item.credit == 0 ? '' : item.credit | formatCurrencyNumber }}
							</template>
							<template v-slot:[`item.checked`]="{ item }">
								<v-hover v-slot="{ hover }">
									<v-icon small @click="changeOperationStatus(item)" :color="hover ? 'blue' : item.checked ? 'green' : 'red'">
										{{ item.checked ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
									</v-icon>
								</v-hover>
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-hover v-slot="{ hover }">
									<v-icon small class="mr-2" @click="editOperation(item.id)" :color="hover ? 'blue' : 'dark grey'">mdi-pencil</v-icon>
								</v-hover>
								<v-hover v-slot="{ hover }">
									<v-icon small @click="deleteOperation(item.id)" :color="hover ? 'red' : 'dark grey'">mdi-delete</v-icon>
								</v-hover>
							</template>
							<template slot="body.append">
								<tr class="pink--text">
									<th>Total actuel</th>
									<th></th>
									<th></th>
									<th>{{ sumCheckedDebitOperations | formatCurrencyNumber }}</th>
									<th>{{ sumCheckedCreditOperations | formatCurrencyNumber }}</th>
									<th>{{ sumDifferenceCheckedOperations | formatCurrencyNumber }}</th>
									<th></th>
								</tr>
								<tr class="blue--text">
									<th>Total prévisionnel</th>
									<th></th>
									<th></th>
									<th>{{ sumCheckedAndUncheckedOperations('debit') | formatCurrencyNumber }}</th>
									<th>{{ sumCheckedAndUncheckedOperations('credit') | formatCurrencyNumber }}</th>
									<th>{{ sumDifferenceCheckedAndUnCheckedOperations() | formatCurrencyNumber }}</th>
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
		currentFile: undefined,
		dialog: false,
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
				})
				.finally(() => {
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

		changeOperationStatus(item) {
			item.checked = !item.checked;
			const operation = { ...item };
			operation.debit = operation.debit.toString();
			operation.credit = operation.credit.toString();
			OperationsDataService.update(operation.id, operation).catch((e) => {
				console.log('error : ' + e);
			});
		},

		/**
		 * Exporte toutes les opérations dans un fichier JSON
		 */
		exportData() {
			const jsonOperations = JSON.stringify(this.operations);
			console.log(jsonOperations);
			let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonOperations);

			let exportFileDefaultName = 'data.json';

			let linkElement = document.createElement('a');
			linkElement.setAttribute('href', dataUri);
			linkElement.setAttribute('download', exportFileDefaultName);
			linkElement.click();
		},

		/**
		 * Définit le fichier à importer
		 */
		selectFile(file) {
			this.currentFile = file;
		},

		/**
		 * Importe toutes les opérations depuis un fichier JSON
		 */
		importData() {
			if (this.currentFile) {
				var reader = new FileReader();
				reader.readAsText(this.currentFile, 'UTF-8');
				const maId = this.ma.id;
				reader.onload = function (evt) {
					const operationsJson = evt.target.result; // On récupère le contenu du fichier
					const operations = JSON.parse(operationsJson); // On le transforme en un objet JSON
					operations.forEach((element) => {
						delete element['id']; // On supprime l'ID qui devient inutile puisque les objets opérations vont être recréés
						element['credit'] = element['credit'].toString(); // L'API attend un string
						element['debit'] = element['debit'].toString(); // L'API attend un string
						element['monthlyAccount'] = '/api/monthly_accounts/' + maId; // Il faut avoir un lien vers le compte mensuel
						OperationsDataService.create(element); // On créé l'opération
					});
				};
				// TODO Implémenter le reader.onerror...
				reader.onloadend = () => {
					this.retrieveOperations();
						this.dialog = false;
				}
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
					value: 'dateOp',
				},
				{ text: 'Catégorie', sortable: false, value: 'category' },
				{ text: 'Libellé', sortable: false, value: 'description' },
				{ text: 'Débit', sortable: false, value: 'debit' },
				{ text: 'Crédit', sortable: false, value: 'credit' },
				{ text: 'Pointée ?', value: 'checked' },
				{ text: 'Actions', sortable: false, value: 'actions' },
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
		console.log(this.ma);
		this.maSlug = this.$route.params.maSlug;
	},
};
</script>
