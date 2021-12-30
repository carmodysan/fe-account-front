<template>
	<!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition du compte -->
	<!-- Attention, on ne peut pas modifier la catégorie du compte -->
	<v-dialog v-model="dialog" :key="item.id + 'editKey'" persistent max-width="290">
		<template #activator="dialogEditActivator">
			<v-tooltip bottom color="warning">
				<template #activator="tooltipEditActivator">
					<v-btn
						v-on="{ ...dialogEditActivator.on, ...tooltipEditActivator.on }"
						@click.stop="dialog = true"
						fab
						outlined
						elevation="2"
						small
						class="mx-2"
						color="warning"
					>
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
				</template>
				<span>Modifier</span>
			</v-tooltip>
		</template>
		<v-card>
			<v-card-title>Modification d'un compte</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="item.name" :rules="helper.formRules.accountName" label="Nom du compte" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-select
							v-model="establishmentSelected"
							:items="helper.formSelect.establishments"
							:rules="helper.formRules.establishment"
							label="Etablissement"
							persistent-hint
							required
						></v-select>
					</v-col>
					<v-col cols="12">
						<v-menu ref="menuCreate" v-model="menuEditDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field v-model="item.createAt" label="Choisissez une date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
							</template>
							<v-date-picker v-model="item.createAt" no-title scrollable @input="menuEditDatePicker = false"> </v-date-picker>
						</v-menu>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialog = false">Annuler</v-btn>
				<v-btn @click="editAccount()">Modifier</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../config/formAccountHelper';

export default {
	name: 'DialogEditAccount',

	props: {
		item: Object, // L'objet représentant un compte
	},

	data() {
		return {
			dialog: false,

			// Le v-select a besoin d'un objet, aussi on le créé à partir de l'établissement du compte 
			establishmentSelected: {
				text: this.item.establishment,
				value: this.item.establishment,
			},

			menuEditDatePicker: false,

			// Helper formulaire (règles, listes...)
			helper: formHelper,
		};
	},

	methods: {
		...mapActions({
			editAccountInStore: 'accounts/editAccount', // Envoie la modification d'un compte dans le store et lance le rafraichissement de la liste des comptes.
		}),

		/**
		 * Modifie le compte
		 */
		editAccount() {
			this.dialog = false; // On ferme le dialog
			this.item.establishment = this.establishmentSelected.text; // On récupère le nouveau établissement si nécessaire avant de l'envoyer à l'API.
			this.editAccountInStore(this.item);
		},
	},
};
</script>
