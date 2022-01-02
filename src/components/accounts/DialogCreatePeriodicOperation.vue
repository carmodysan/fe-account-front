<template>
	<v-dialog v-model="dialogCreatePeriodicOperation" persistent max-width="320">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">
				<v-icon class="mr-2">mdi-plus</v-icon>
				Nouvelle opération périodique
			</v-btn>
		</template>
		<v-card>
			<v-card-title>Création d'une opération périodique</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" class="pb-0">
						<v-select
							v-model="formCreatePeriodicOperation.dayOfMonth"
                            :items="helper.formOperationSelect.dayOfMonth"
							:rules="helper.formRules.category"
							label="Jour du mois"
							persistent-hint
							required
						></v-select>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-select
							v-model="formCreatePeriodicOperation.category"
							:items="helper.formOperationSelect.categories"
							:rules="helper.formRules.category"
							label="Catégorie de l'opération"
							persistent-hint
							required
						></v-select>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="formCreatePeriodicOperation.description" :rules="helper.formRules.accountName" label="Description" required></v-text-field>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="formCreatePeriodicOperation.credit" :rules="helper.formRules.number" label="Crédit (€)" required></v-text-field>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="formCreatePeriodicOperation.debit" :rules="helper.formRules.number" label="Débit (€)" required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialogCreatePeriodicOperation = false">Annuler</v-btn>
				<v-btn color="success" @click="createOperation()">Créer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../config/formAccountHelper';

export default {
	name: 'DialogCreatePeriodicOperation',

    props: {
        authorId: String
    },

	data() {
		return {
			dialogCreatePeriodicOperation: false,

			// Le formulaire
			formCreatePeriodicOperation: {},

			menuCreateDatePicker: false,

			// Helper formulaire (règles, listes...)
			helper: formHelper,
		};
	},

	methods: {
        ...mapActions({
            createPeriodicOperationInStore: 'periodicOperation/createPeriodicOperation', // Envoie la création d'une opération périodique
        }),

		/**
		 * Création d'une opération périodique
		 */
		createOperation() {
            this.dialogCreatePeriodicOperation = false; // On ferme la fenêtre modale
            this.formCreatePeriodicOperation.authorId = this.authorId; // On ajoute l'identifiant de l'utilisateyr
			
            this.createPeriodicOperationInStore(this.formCreatePeriodicOperation); // On lance la création depuis le store

            this.initializeFormOperation(); // On réinitialise le formulaire
		},

        /**
         * Initialise le formulaire (utile quand on affiche plusieurs fois ce composant pour créer plusieurs opérations)
         */
        initializeFormOperation() {
            this.formCreatePeriodicOperation = {
				dayOfMonth: 1,
				category: '',
				description: '',
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