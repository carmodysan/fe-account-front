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
			<v-card-title>Modification d'un grade</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="item.level" type="number" min="1" max="3" label="Niveau du grade (1, 2, 3, ...)" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="item.labelLong" label="Nom du grade" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="item.labelShort" label="Nom abrégé du grade" required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialog = false" color="secondary">Annuler</v-btn>
				<v-btn @click="editRank()" color="warning">Modifier</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'DialogEditRank',

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
            editRankInStore: 'publicService/editRank',
        }),

        /**
		 * Modifie le grade
		 */
		editRank() {
			this.dialog = false; // On ferme le dialog
			if (typeof this.item.level === "string") {
				this.item.level = parseInt(this.item.level); // On parse en int le niveau du grade.
			}
			this.editRankInStore(this.item);
		},
    }
}
</script>