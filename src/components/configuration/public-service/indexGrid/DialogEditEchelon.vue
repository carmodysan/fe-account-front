<template>
    <!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition du grade -->
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
			<v-card-title>Modification d'un échelon</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="item.echelon" type="number" min="1" max="20" label="Echelon" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="item.monthDuration" type="number" min="1" max="100" label="Durée en mois" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="item.grossIndex" type="number" min="1" max="2000" label="Indice brut" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="item.increaseIndex" type="number" min="1" max="1500" label="Indice majoré" required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialog = false" color="secondary">Annuler</v-btn>
				<v-btn @click="editEchelon()" color="warning">Modifier</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'DialogEditEchelon',

    props: {
		item: Object, // L'objet représentant un compte
	},

    data() {
        return {
            dialog: false,
        }
    },

    methods: {
        ...mapActions({
            editEchelonInStore: 'publicService/editEchelon',
        }),

        /**
		 * Modifie le grade
		 */
		editEchelon() {
			this.dialog = false; // On ferme le dialog
			if (typeof this.item.echelon === "string") {
				this.item.echelon = parseInt(this.item.echelon); // On parse en int le niveau de l'échelon.
			}
			if (typeof this.item.monthDuration === "string") {
				this.item.monthDuration = parseInt(this.item.monthDuration); // On parse en int la durée en mois de l'échelon.
			}
			if (typeof this.item.grossIndex === "string") {
				this.item.grossIndex = parseInt(this.item.grossIndex); // On parse en int l'indice brut de l'échelon.
			}
			if (typeof this.item.increaseIndex === "string") {
				this.item.increaseIndex = parseInt(this.item.increaseIndex); // On parse en int l'indice majoré de l'échelon.
			}
			this.editEchelonInStore(this.item);
		},
    }
}
</script>