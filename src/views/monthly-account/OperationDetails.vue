<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<div v-if="currentOperation">
					<v-card elevation="3" outlined class="px-5 py-3">
						<v-card-title>Ajouter une opération</v-card-title>
						<v-form ref="form" v-model="valid" lazy-validation>
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
							<v-text-field v-model="currentOperation.credit" :rules="numberRules" type="number" step="0.01" label="Crédit (€)" required></v-text-field>
							<!-- Débit -->
							<v-text-field v-model="currentOperation.debit" :rules="numberRules" type="number" step="0.01" label="Débit (€)" required></v-text-field>
							<!-- Pointée ? -->
							<v-text-field v-model="currentOperation.checked" :rules="numberRules" type="checkbox" label="Pointée ?" required></v-text-field>

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
import OperationsDataService from '../../services/OperationsDataService';

export default {
	name: 'Operation-Details',

	data: () => ({
		valid: true,
		currentOperation: null,
		message: '',
		menuDatePicker: false,

		categoryRules: [(v) => !!v || 'La catégorie est obligatoire'],
		descriptionRules: [(v) => !!v || 'La description est obligatoire'],
		// TODO Mettre en place un vrai validateur pour les montants chiffrés (crédit et débit)
		numberRules: [(v) => !!v || 'Un montant est obligatoire'],

		form: {
			dateOp: new Date(Date.now()).toISOString().substr(0, 10),
			category: '',
			description: '',
			credit: 0,
			debit: 0,
			checked: false,
			monthlyAccount: '',
		},
	}),

	methods: {
		getOperation(id) {
			OperationsDataService.get(id)
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
			OperationsDataService.update(this.currentOperation.id, this.currentOperation)
				.then((response) => {
					console.log(response.data);
					this.message = 'The operation was update successfully !';
                    this.$router.push({ name: 'operations-list', params: { maId: this.$route.params.maId } });
				})
				.catch((e) => {
					console.log(e);
				});
		},

		deleteOperation() {
			OperationsDataService.delete(this.currentOperation.id).then((response) => {
				console.log(response.data);
				this.$router.push({ name: 'operations-list', params: { maId: this.$route.params.maId } });
			});
		},

		/**
		 * Formatte les valeurs du formulaire avec les types attendus par l'API
		 */
		formatCurrentOperation() {
			const credit = parseFloat(this.currentOperation.credit);
			const debit = parseFloat(this.currentOperation.debit);
			this.currentOperation.credit = credit;
			this.currentOperation.debit = debit;
			this.currentOperation.checked = this.currentOperation.checked === 'true';
		},
	},

	mounted() {
		this.message = '';
		this.getOperation(this.$route.params.id);
	},

	created() {
		this.form.monthlyAccount = '/api/monthly_accounts/' + this.$route.params.maId;
	},
};
</script>
