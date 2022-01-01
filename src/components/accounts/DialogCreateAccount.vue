<template>
	<v-dialog v-model="dialogCreateAccount" persistent max-width="290">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">
				<v-icon class="mr-2">mdi-plus</v-icon>
				Nouveau compte
			</v-btn>
		</template>
		<v-card>
			<v-card-title>Création d'un compte</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="formCreateAccount.name" :rules="helper.formRules.accountName" label="Nom du compte" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-select
							v-model="formCreateAccount.establishment"
							:items="helper.formAccountSelect.establishments"
							:rules="helper.formRules.establishment"
							label="Etablissement"
							persistent-hint
							required
						></v-select>
					</v-col>
					<v-col cols="12">
						<v-select
							v-model="formCreateAccount.category"
							:items="helper.formAccountSelect.categories"
							:rules="helper.formRules.category"
							label="Catégorie du compte"
							persistent-hint
							required
						></v-select>
					</v-col>
					<v-col cols="12">
						<v-menu ref="menuCreate" v-model="menuCreateDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="formCreateAccount.createAt"
									label="Choisissez une date"
									prepend-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker v-model="formCreateAccount.createAt" no-title scrollable @input="menuCreateDatePicker = false"> </v-date-picker>
						</v-menu>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialogCreateAccount = false">Annuler</v-btn>
				<v-btn @click="createAccount()">Créer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../config/formAccountHelper';

export default {
	name: 'DialogCreateAccount',

	props: {
		userId: String,
	},

	data: () => ({
		dialogCreateAccount: false,

		// Partie formulaire
		formCreateAccount: {
			name: '',
			createAt: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
			category: '',
			establishment: '',
			authorId: '',
		},

		menuCreateDatePicker: false,

		// Helper formulaire (règles, listes...)
		helper: formHelper,
	}),

	methods: {
		...mapActions({
			createAccountInStore: 'accounts/createAccount', // Envoie la création d'un compte dans le store et lance le rafraichissement de la liste des comptes.
		}),

		/**
		 * Création d'un compte
		 */
		createAccount() {
			this.dialogCreateAccount = false; // On peut fermer la fenêtre modale
			this.formCreateAccount.authorId = this.userId; // On définit l'utilisateur propriétaire du compte

			this.createAccountInStore(this.formCreateAccount); // On lance la création du compte en l'envoyant à l'API.
		},
	},
};
</script>
