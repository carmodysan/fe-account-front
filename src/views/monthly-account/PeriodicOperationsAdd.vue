<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<v-card elevation="3" outlined class="px-5 py-3">
					<v-card-title>Ajouter une opération périodique</v-card-title>
					<v-form ref="form" v-model="valid" lazy-validation>
						<!-- Date operation picker -->
						<v-text-field v-model="form.dayOfMonth" :rules="numberRules" type="number" step="1" label="Jour du mois" required></v-text-field>
						<!-- Category -->
						<v-text-field v-model="form.category" :rules="categoryRules" label="Catégories" required></v-text-field>
						<!-- Description -->
						<v-text-field v-model="form.description" :rules="descriptionRules" label="Libellé" required></v-text-field>
						<!-- Credit -->
						<v-text-field v-model="form.credit" :rules="numberRules" type="decimal" label="Crédit (€)" required></v-text-field>
						<!-- Débit -->
						<v-text-field v-model="form.debit" :rules="numberRules" type="decimal" label="Débit (€)" required></v-text-field>

						<v-btn :disabled="!valid" color="success" class="mr-4" @click="submit"> Envoyer </v-btn>
					</v-form>
				</v-card>
			</v-row>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import PeriodicOperationsDataService from '../../services/PeriodicOperationsDataService';

export default {
	name: 'Add-Periodic-Operation',

	data: () => ({
		valid: true,
		menuDatePicker: false,

		categoryRules: [(v) => !!v || 'La catégorie est obligatoire'],
		descriptionRules: [(v) => !!v || 'La description est obligatoire'],
		// TODO Mettre en place un vrai validateur pour les montants chiffrés (crédit et débit et dayOfMonth)
		numberRules: [(v) => !!v || 'Un montant est obligatoire'],

		form: {
			dayOfMonth: 1,
			category: '',
			description: '',
			credit: '0',
			debit: '0',
			authorId: ''
		},
	}),

	methods: {
		/**
		 * Envoi le formulaire à l'API
		 */
		async submit() {
			this.formatForm();
			await PeriodicOperationsDataService.create(this.form)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.$router.replace({
						name: 'periodic-operations',
                        params: {
                            authorId: this.$route.params.authorId
                        }
					});
				});
		},

		/**
		 * Formatte le formulaire pour l'envoyer à l'API.
		 */
		formatForm() {
			this.form.dayOfMonth = parseInt(this.form.dayOfMonth);
		}
	},

	mounted() {
		console.log('Author : ' + this.$route.params.authorId);
		this.form.authorId = this.$route.params.authorId;
	},
};
</script>
