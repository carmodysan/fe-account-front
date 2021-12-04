<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<div v-if="isLoading">
				<v-skeleton-loader
					class="mx-auto"
					min-width="300"
					type="card-heading, list-item-avatar, divider, list-item-avatar, divider, list-item-avatar, divider"
				></v-skeleton-loader>
			</div>
			<div v-else>
				<v-card min-width="300" class="mb-2">
					<v-card-title>
						<v-row>
							<v-col cols="10">Opérations périodiques</v-col>
							<v-col cols="2"><v-btn :to="{ name: 'periodic-operations-add', params: { authorId: authorId } }"> New </v-btn></v-col>
						</v-row>
					</v-card-title>
					<v-card-text>
						<div class="font-weight-bold ml-8 mb-2">Today</div>
						<v-timeline align-top dense>
							<v-timeline-item v-for="operation in operations" :key="operation.id" :color="getColorTimeLine(operation.debit)" small>
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
											<strong>{{ operation.category }}</strong>
										</v-row>
										<v-row>
											{{ operation.description }}
										</v-row>
									</v-col>
									<v-col cols="2" class="mb-4 d-flex justify-center">
										<v-row>
											<v-icon small class="mr-2" @click="editPeriodicOperation(operation.id)">mdi-pencil</v-icon>
											<v-icon small class="mt-2" @click="deletePeriodicOperation(operation.id)">mdi-delete</v-icon>
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
import PeriodicOperationsDataService from '../../services/PeriodicOperationsDataService';

// TODO Créer des messages d'alerte sur les pages OperationDetails et OperationAdd

export default {
	name: 'operations-list',

	data: () => ({
		authorId: '',
		maSlug: '',
		operations: [],
		isLoading: true,
	}),

	methods: {
		retrievePeriodicOperations() {
			this.isLoading = true;
			PeriodicOperationsDataService.getAll(this.authorId)
				.then((response) => {
					this.operations = response.data['hydra:member'].map(this.getDisplayOperation);
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.isLoading = false;
				});
		},

		refreshList() {
			this.retrievePeriodicOperations();
		},

		editPeriodicOperation(id) {
			// TODO Vérifier l'utilité du this.maSlug qui pourrait sûrement être enlevé
			this.$router.push({ name: 'periodic-operations-details', params: { id: id, authorId: this.authorId } });
		},

		deletePeriodicOperation(id) {
			PeriodicOperationsDataService.delete(id)
				.then(() => {
					this.refreshList();
				})
				.catch((e) => {
					console.log(e);
				});
		},

		getDisplayOperation(operation) {
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

	mounted() {
		this.retrievePeriodicOperations();
	},

	created() {
		this.authorId = this.$route.params.authorId;
	},
};
</script>
