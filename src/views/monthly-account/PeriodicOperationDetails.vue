<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<div v-if="currentOperation">
					<v-card elevation="3" outlined class="px-5 py-3">
						<v-card-title>Ajouter une opération</v-card-title>
						<v-form ref="form" v-model="valid" lazy-validation>
							<!-- Date operation picker -->
							<v-text-field v-model="currentOperation.dayOfMonth" :rules="numberRules" type="number" step="1" label="Jour du mois" required></v-text-field>
							<!-- Category -->
							<v-text-field v-model="currentOperation.category" :rules="categoryRules" label="Catégories" required></v-text-field>
							<!-- Description -->
							<v-text-field v-model="currentOperation.description" :rules="descriptionRules" label="Libellé" required></v-text-field>
							<!-- Credit -->
							<v-text-field v-model="currentOperation.credit" :rules="numberRules" type="decimal" label="Crédit (€)" required></v-text-field>
							<!-- Débit -->
							<v-text-field v-model="currentOperation.debit" :rules="numberRules" type="decimal" label="Débit (€)" required></v-text-field>

							<v-divider class="my-5"></v-divider>

							<v-btn color="error" small class="mr-2" @click="deleteOperation"> Delete </v-btn>
							<v-btn color="success" small @click="updateOperation"> Update </v-btn>
						</v-form>
					</v-card>
				</div>
                <div v-else>
                    <p>Please check Operation</p>
                </div>
			</v-row>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import PeriodicOperationsDataService from '../../services/PeriodicOperationsDataService';

export default {
	name: 'Periodic-Operation-Details',

	data: () => ({
		valid: true,
		currentOperation: null,
		message: '',
		menuDatePicker: false,
		authorId: '',

		categoryRules: [(v) => !!v || 'La catégorie est obligatoire'],
		descriptionRules: [(v) => !!v || 'La description est obligatoire'],
		// TODO Mettre en place un vrai validateur pour les montants chiffrés (crédit et débit)
		numberRules: [(v) => !!v || 'Un montant est obligatoire'],
	}),

	methods: {
		getOperation(id) {
			PeriodicOperationsDataService.get(id)
				.then((response) => {
					console.log(response.data);
					this.currentOperation = response.data;
				})
				.catch((e) => {
					console.log(e);
				});
		},

		updateOperation() {
            this.formatCurrentOperation();
			PeriodicOperationsDataService.update(this.currentOperation.id, this.currentOperation)
				.then((response) => {
					console.log(response.data);
					this.message = 'The operation was update successfully !';
                    this.$router.push({ name: 'periodic-operations', params: { authorId: this.authorId } });
				})
				.catch((e) => {
					console.log(e);
				});
		},

		deleteOperation() {
			PeriodicOperationsDataService.delete(this.currentOperation.id).then((response) => {
				console.log(response.data);
				this.$router.push({ name: 'periodic-operations', params: { authorId: this.authorId } });
			});
		},

		/**
		 * Formatte les valeurs du formulaire avec les types attendus par l'API (à savoir de type String)
		 */
		formatCurrentOperation() {
			this.currentOperation.dayOfMonth = parseInt(this.currentOperation.dayOfMonth);
			this.currentOperation.credit = (typeof this.currentOperation.credit === 'string' ? this.currentOperation.credit : '0');
			this.currentOperation.debit = (typeof this.currentOperation.debit === 'string' ? this.currentOperation.debit : '0');
		},
	},

	mounted() {
		this.message = '';
		this.authorId = this.$route.params.authorId;
		this.getOperation(this.$route.params.id);
	},
};
</script>
