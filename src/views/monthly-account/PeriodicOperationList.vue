<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<v-card>
				<v-card-title>
					<v-row>
						<v-col cols="10">Opérations périodiques</v-col>
						<v-col cols="2"><v-btn :to="{ name: 'periodic-operations-add', params: { authorId: authorId } }"> New </v-btn></v-col>
					</v-row>
				</v-card-title>
				<v-card-text>
					<div class="font-weight-bold ml-8 mb-2">Today</div>
					<v-timeline align-top dense>
						<v-timeline-item v-for="operation in operations" :key="operation.id" color="purple" small>
							<div>
								<div class="font-weight-normal">
									<strong>{{ operation.dayOfMonth }}</strong> @{{ operation.category }}
								</div>
								<div>
									{{ operation.description }}
									<v-icon small class="mr-2" @click="editPeriodicOperation(operation.id)">mdi-pencil</v-icon>
									<v-icon small @click="deletePeriodicOperation(operation.id)">mdi-delete</v-icon>
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
import PeriodicOperationsDataService from '../../services/PeriodicOperationsDataService';

// TODO Créer des messages d'alerte sur les pages OperationDetails et OperationAdd

export default {
	name: 'operations-list',

	data: () => ({
		authorId: '',
		maSlug: '',
		operations: [],
	}),

	methods: {
		retrievePeriodicOperations() {
			PeriodicOperationsDataService.getAll(this.authorId)
				.then((response) => {
					this.operations = response.data['hydra:member'].map(this.getDisplayOperation);
				})
				.catch((e) => {
					console.log(e);
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
	},

	mounted() {
		this.retrievePeriodicOperations();
	},

	created() {
		this.authorId = this.$route.params.authorId;
	},
};
</script>
