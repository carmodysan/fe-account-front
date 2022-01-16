<template>
	<!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition d'une opération -->
	<v-dialog v-model="dialog" :key="item.id + 'deleteKey'" persistent max-width="320">
		<template #activator="dialogDeleteActivator">
			<v-tooltip bottom color="error">
				<template #activator="tooltipDeleteActivator">
					<v-btn
						v-on="{ ...dialogDeleteActivator.on, ...tooltipDeleteActivator.on }"
						@click.stop="dialog = true"
						fab
						outlined
						elevation="2"
						small
						class="mx-2"
						color="error"
					>
						<v-icon>mdi-delete</v-icon>
					</v-btn>
				</template>
				<span>Supprimer</span>
			</v-tooltip>
		</template>
		<v-card>
			<v-card-title>Suppression de l'opération</v-card-title>
			<v-card-text> Attention, êtes vous bien sûr de vouloir supprimer cette opération ? </v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialog = false">Annuler</v-btn>
				<v-btn color="error" @click="deleteOperation()">Supprimer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'DialogEditOperation',

	props: {
		item: Object, // L'objet représentant une opération
	},

	data() {
		return {
			dialog: false, // Le model du dialog
		};
	},

    methods: {
		...mapActions({
			deleteOperationInStore: 'savingsAccountOperation/deleteOperation', // Envoie la modification d'un compte dans le store et lance le rafraichissement de la liste des comptes.
		}),

		/**
		 * Modifie l'opération'
		 */
		deleteOperation() {
			this.dialog = false; // On ferme le dialog
			this.deleteOperationInStore(this.item);
		},
	},
};
</script>
