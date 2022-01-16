<template>
	<v-dialog v-model="dialogCreateInterestRate" persistent max-width="320">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="primary" class="text-capitalize button-shadow mr-1">
				<v-icon class="mr-2">mdi-plus</v-icon>
				Nouveau taux
			</v-btn>
		</template>
		<v-card>
			<v-card-title>Création d'un taux</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" class="pb-0">
						<v-menu ref="menuCreate" v-model="menuCreateDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="formCreateInterestRate.startDate"
									label="Choisissez une date de début"
									prepend-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker v-model="formCreateInterestRate.startDate" no-title scrollable @input="menuCreateDatePicker = false"> </v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="formCreateInterestRate.rate" :rules="helper.formRules.number" label="Taux d'intérêts" required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialogCreateInterestRate = false">Annuler</v-btn>
				<v-btn color="success" @click="createOperation()">Créer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../../config/formAccountHelper';

export default {
	name: 'DialogCreateInterestRate',

    props: {
        savingsAccountId: String
    },

	data() {
		return {
			dialogCreateInterestRate: false,

			// Le formulaire
			formCreateInterestRate: {},

			menuCreateDatePicker: false,

			// Helper formulaire (règles, listes...)
			helper: formHelper,
		};
	},

	methods: {
        ...mapActions({
            createInterestRateInStore: 'interestRate/createInterestRate', // Envoie la création d'un taux d'intérêts
        }),

		/**
		 * Création d'une opération
		 */
		createOperation() {
            this.dialogCreateInterestRate = false; // On ferme la fenêtre modale
            this.formCreateInterestRate.savingsAccount = '/api/savings_accounts/' + this.savingsAccountId; // On ajoute l'identifiant du compte d'épargne
			this.formCreateInterestRate.endDate = '2099-12-31'; // On créé une date de fin lointaine
			
            this.createInterestRateInStore({interestRate: this.formCreateInterestRate, accountId: this.savingsAccountId}); // On lance la création depuis le store

            this.initializeFormOperation(); // On réinitialise le formulaire
		},

        /**
         * Initialise le formulaire (utile quand on affiche plusieurs fois ce composant pour créer plusieurs taux)
         */
        initializeFormOperation() {
            this.formCreateInterestRate = {
				startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
				rate: '0',
			};
        }
	},

    mounted() {
        this.initializeFormOperation();
    }
};
</script>
