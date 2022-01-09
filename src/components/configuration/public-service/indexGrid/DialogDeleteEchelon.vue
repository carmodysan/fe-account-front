<template>
    <!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire de suppression d'un grade -->
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
			<v-card-title>Suppression de l'échelon</v-card-title>
			<v-card-text> Attention, êtes vous bien sûr de vouloir supprimer cet échelon ? </v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialog = false">Annuler</v-btn>
				<v-btn color="error" @click="deleteEchelon()">Supprimer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'DialogDeleteEchelon',

    props: {
		item: Object, // L'objet représentant une opération
	},

    data() {
        return {
            dialog: false,
        }
    },

    methods: {
		...mapActions({
			deleteEchelonInStore: 'publicService/deleteEchelon', // Envoie la suppression d'un grade dans le store et lance le rafraichissement de la liste des grades.
		}),

		/**
		 * Supprime le grade
		 */
		deleteEchelon() {
			this.dialog = false; // On ferme le dialog
			this.deleteEchelonInStore(this.item);
		},
	},

}
</script>