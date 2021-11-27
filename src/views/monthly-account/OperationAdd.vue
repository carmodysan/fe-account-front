<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<v-card elevation="3" outlined class="px-5 py-3">
					<v-card-title>Ajouter une opération</v-card-title>
					<v-form ref="form" v-model="valid" lazy-validation>
						<!-- Date operation picker -->
						<v-menu
							ref="menu"
							v-model="menuDatePicker"
							:close-on-content-click="false"
							:return-value.sync="form.dateOp"
							transition="scale-transition"
							offset-y
							min-width="auto"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field v-model="form.dateOp" label="Choisissez une date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
							</template>
							<v-date-picker v-model="form.dateOp" no-title scrollable>
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="menuDatePicker = false"> Cancel </v-btn>
								<v-btn text color="primary" @click="$refs.menu.save(form.dateOp)"> OK </v-btn>
							</v-date-picker>
						</v-menu>
						<!-- Category -->
						<v-text-field v-model="form.category" :rules="categoryRules" label="Catégories" required></v-text-field>
						<!-- Description -->
						<v-text-field v-model="form.description" :rules="descriptionRules" label="Libellé" required></v-text-field>
						<!-- Credit -->
						<v-text-field v-model="form.credit" :rules="numberRules" type="number" step="0.01" label="Crédit (€)" required></v-text-field>
						<!-- Débit -->
						<v-text-field v-model="form.debit" :rules="numberRules" type="number" step="0.01" label="Débit (€)" required></v-text-field>
						<!-- Pointée ? -->
						<v-text-field v-model="form.checked" :rules="numberRules" type="checkbox" label="Pointée ?" required></v-text-field>

						<v-btn :disabled="!valid" color="success" class="mr-4" @click="submit"> Envoyer </v-btn>
					</v-form>
				</v-card>
			</v-row>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import OperationsDataService from '../../services/OperationsDataService';

export default {
	name: 'Add-Operation',

	data: () => ({
		valid: true,
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
		/*...mapActions({
			login: 'auth/login',
		}),*/

		/**
		 * Envoi le formulaire à l'API
		 */
		async submit() {
			console.log('submit');
			this.formatForm();
			await OperationsDataService.create(this.form)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.$router.replace({
						name: 'operations-list',
                        params: {
                            maId: this.$route.params.maId
                        }
					});
				});
		},

		/**
		 * Formatte les valeurs du formulaire avec les types attendus par l'API
		 */
		formatForm() {
			const credit = parseFloat(this.form.credit);
			const debit = parseFloat(this.form.debit);
			this.form.credit = credit;
			this.form.debit = debit;
			this.form.checked = this.form.checked === 'true';
		},
	},

	created() {
		this.form.monthlyAccount = '/api/monthly_accounts/' + this.$route.params.maId;
	},
};
</script>
