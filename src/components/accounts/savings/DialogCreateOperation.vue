<template>
	<v-dialog v-model="dialogCreateOperation" persistent max-width="320">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">
				<v-icon class="mr-2">mdi-plus</v-icon>
				Nouvelle opération
			</v-btn>
		</template>
		<v-card>
			<v-card-title>Création d'une opération</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" class="pb-0">
						<v-menu ref="menuCreate" v-model="menuCreateDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="formCreateOperation.dateOp"
									label="Choisissez une date"
									prepend-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker v-model="formCreateOperation.dateOp" no-title scrollable @input="menuCreateDatePicker = false"> </v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="formCreateOperation.credit" :rules="helper.formRules.number" label="Crédit (€)" required></v-text-field>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="formCreateOperation.debit" :rules="helper.formRules.number" label="Débit (€)" required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialogCreateOperation = false">Annuler</v-btn>
				<v-btn color="success" @click="createOperation()">Créer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../../config/formAccountHelper';

export default {
	name: 'DialogCreateOperation',

    props: {
        savingsAccountId: String
    },

	data() {
		return {
			dialogCreateOperation: false,

			// Le formulaire
			formCreateOperation: {},

			menuCreateDatePicker: false,

			// Helper formulaire (règles, listes...)
			helper: formHelper,
		};
	},

	methods: {
        ...mapActions({
            createOperationInStore: 'savingsAccountOperation/createOperation', // Envoie la création d'une opération
        }),

		/**
		 * Création d'une opération
		 */
		createOperation() {
            this.dialogCreateOperation = false; // On ferme la fenêtre modale
            this.formCreateOperation.savingsAccount = '/api/savings_accounts/' + this.savingsAccountId; // On ajoute l'identifiant du compte d'épargne
			
            this.createOperationInStore({operation: this.formCreateOperation, accountId: this.savingsAccountId}); // On lance la création depuis le store

            this.initializeFormOperation(); // On réinitialise le formulaire
		},

        /**
         * Initialise le formulaire (utile quand on affiche plusieurs fois ce composant pour créer plusieurs opérations)
         */
        initializeFormOperation() {
            this.formCreateOperation = {
				dateOp: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
				credit: '0',
				debit: '0',
			};
        }
	},

    mounted() {
        this.initializeFormOperation();
    }
};
</script>
