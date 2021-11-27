<template>
	<v-container fill-height fluid>
		<div align="center" justify="center">
			<v-btn :to="{ name: 'operation-add', params: { maId: maId } }"> New </v-btn>
			<v-data-table :headers="headers" :items="operations" item-key="id">
				<template v-slot:[`item.actions`]="{ item }">
					<v-icon small class="mr-2" @click="editOperation(item.id)">mdi-pencil</v-icon>
					<v-icon small @click="deleteOperation(item.id)">mdi-delete</v-icon>
				</template>
			</v-data-table>
		</div>
	</v-container>
</template>

<style scoped></style>

<script>
import OperationsDataService from '../../services/OperationsDataService';
import { mapGetters } from 'vuex';

// TODO Créer des messages d'alerte sur les pages OperationDetails et OperationAdd

export default {
	name: 'operations-list',

	data: () => ({
		maId: '',
        maSlug: '',
		operations: [],
	}),

	methods: {
		retrieveOperations() {
			OperationsDataService.getAll(this.maId)
				.then((response) => {
					this.operations = response.data["hydra:member"].map(this.getDisplayOperation);
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
			this.$router.push({ name: 'operation-details', params: { id: id, maId: this.maId, maSlug: this.maSlug } });
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
	},

	created() {
		this.maId = this.$route.params.maId;
        this.maSlug = this.$route.params.maSlug;
	},
};
</script>
