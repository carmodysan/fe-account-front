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
								<!-- Partie édition du compte -->
								<v-dialog max-width="300" v-model="editDialog">
									<template v-slot:activator="{ on, attrs }">
										<v-hover v-slot="{ hover }">
											<v-icon small class="mr-2" v-bind="attrs" @click="getCurrentOperation(item.id)" v-on="on" :color="hover ? 'blue' : 'dark grey'"
												>mdi-pencil</v-icon
											>
										</v-hover>
									</template>
									<v-card>
										<v-card-title>
											<span class="text-h5">Modifier l'opération</span>
										</v-card-title>
										<div v-if="isCurrentOperationLoading">
											Test
										</div>
										<v-form v-else ref="form" v-model="valid" lazy-validation>
											<!-- Date operation picker -->
											<v-menu
												ref="menu"
												v-model="menuDatePicker"
												:close-on-content-click="false"
												:return-value.sync="currentOperation.dateOp"
												transition="scale-transition"
												offset-y
												min-width="auto"
											>
												<template v-slot:activator="{ on, attrs }">
													<v-text-field
														v-model="currentOperation.dateOp"
														label="Choisissez une date"
														prepend-icon="mdi-calendar"
														readonly
														v-bind="attrs"
														v-on="on"
													></v-text-field>
												</template>
												<v-date-picker v-model="currentOperation.dateOp" no-title scrollable>
													<v-spacer></v-spacer>
													<v-btn text color="primary" @click="menuDatePicker = false"> Cancel </v-btn>
													<v-btn text color="primary" @click="$refs.menu.save(currentOperation.dateOp)"> OK </v-btn>
												</v-date-picker>
											</v-menu>
											<!-- Category -->
											<v-text-field v-model="currentOperation.category" :rules="categoryRules" label="Catégories" required></v-text-field>
											<!-- Description -->
											<v-text-field v-model="currentOperation.description" :rules="descriptionRules" label="Libellé" required></v-text-field>
											<!-- Credit -->
											<v-text-field v-model="currentOperation.credit" :rules="numberRules" type="decimal" label="Crédit (€)" required></v-text-field>
											<!-- Débit -->
											<v-text-field v-model="currentOperation.debit" :rules="numberRules" type="decimal" label="Débit (€)" required></v-text-field>
											<!-- Pointée ? -->
											<v-checkbox v-model="currentOperation.checked" label="Pointée ?"></v-checkbox>

											<v-divider class="my-5"></v-divider>

											<v-btn color="info" small class="mr-2" @click="editDialog = false"> Annuler </v-btn>
											<v-btn color="success" small @click="editOperation()"> Update </v-btn>
										</v-form>
									</v-card>
								</v-dialog>
								<!-- Partie suppression du compte -->
								<v-dialog max-width="300" v-model="deleteDialog">
									<template v-slot:activator="{ on, attrs }">
										<v-hover v-slot="{ hover }">
											<v-icon small v-bind="attrs" v-on="on" :color="hover ? 'red' : 'dark grey'">mdi-delete</v-icon>
										</v-hover>
									</template>
									<v-card>
										<v-card-title>
											<span class="text-h5">Attention !</span>
										</v-card-title>
										<v-card-text>
											<p>Voulez-vous vraiment supprimer ce compte ?</p>
											<p><i>Attention, cela va supprimer toutes les opérations associées à ce compte...</i></p>
										</v-card-text>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn color="red" @click="deleteDialog = false">Annuler</v-btn>
											<v-btn
												color="success"
												@click="
													deleteDialog = false;
													deleteOperation(item.id);
												"
												>Supprimer</v-btn
											>
										</v-card-actions>
									</v-card>
								</v-dialog>
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
import MonthlyAccountsDataService from '../../services/MonthlyAccountsDataService';
import OperationsDataService from '../../services/OperationsDataService';
import PeriodicOperationsDataService from '../../services/PeriodicOperationsDataService';
import { mapGetters } from 'vuex';

export default {
	name: 'operations-list',

	data: () => ({
		monthlyAccountSlug: '',
		monthlyAccount: Object,

		// Partie suppression d'une opération
		deleteDialog: false,

		// Partie formulaire d'édition d'une opération
		menuDatePicker: false,
		valid: true,
		currentOperation: Object,
		categoryRules: [(v) => !!v || 'La catégorie est obligatoire'],
		descriptionRules: [(v) => !!v || 'La description est obligatoire'],
		// TODO Mettre en place un vrai validateur pour les montants chiffrés (crédit et débit)
		numberRules: [(v) => !!v || 'Un montant est obligatoire'],
		editDialog: false,
		isCurrentOperationLoading: false,

		ma: {},
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
		/**
		 * Récupère le compte mensuel en fonction du slug dans l'url
		 */
		retrieveMonthlyAccount() {
			this.isOperationsLoading = true;
			MonthlyAccountsDataService.getBySlug(this.monthlyAccountSlug)
				.then((response) => {
					this.monthlyAccount = response.data['hydra:member'][0];
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.retrieveOperations();
				});
		},
		retrieveOperations() {
			OperationsDataService.getAll(this.monthlyAccount.id)
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

		/**
		 * Récupère l'opération courante pour l'éditer
		 */
		getCurrentOperation(id) {
			this.isCurrentOperationLoading = true;
			OperationsDataService.get(id)
				.then((response) => {
					this.currentOperation = response.data;
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.isCurrentOperationLoading = false;
				});
		},

		refreshList() {
			this.retrieveOperations();
		},

		/**
		 * Modifie l'opération courante en court d'édition.
		 */
		async editOperation() {
			this.formatCurrentOperation();
			await OperationsDataService.update(this.currentOperation.id, this.currentOperation)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.editDialog = false;
					this.retrieveOperations();
				});
		},

		/**
		 * Supprime l'opération sélectionnée
		 */
		deleteOperation(id) {
			OperationsDataService.delete(id)
				.then(() => {
					this.refreshList();
				})
				.catch((e) => {
					console.log(e);
				});
		},

		/**
		 * Formatte les valeurs du formulaire avec les types attendus par l'API (à savoir de type String)
		 */
		formatCurrentOperation() {
			this.currentOperation.credit = (typeof this.currentOperation.credit === 'string' ? this.currentOperation.credit : this.currentOperation.credit.toString());
			this.currentOperation.debit = (typeof this.currentOperation.debit === 'string' ? this.currentOperation.debit : this.currentOperation.debit.toString());
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
			newOperation.dateOp = new Date(this.monthlyAccount.year, this.monthlyAccount.month - 1, periodicOperation.dayOfMonth + 1).toISOString().substr(0, 10);
			newOperation.category = periodicOperation.category;
			newOperation.description = periodicOperation.description;
			newOperation.credit = periodicOperation.credit;
			newOperation.debit = periodicOperation.debit;
			newOperation.checked = false;
			newOperation.monthlyAccount = '/api/monthly_accounts/' + this.monthlyAccount.id;
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
				const maId = this.monthlyAccount.id;
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
				};
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
		this.monthlyAccountSlug = window.location.pathname.split('/')[3]; // On récupère le slug du compte à récupérer.
		console.log(this.monthlyAccountSlug + ' ' + window.location.pathname);
		this.retrieveMonthlyAccount();
		this.retrievePeriodicOperations();
	},
};
</script>
