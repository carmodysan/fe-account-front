<template>
    <!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition d'une opération -->
    <v-dialog v-model="dialog" :key="item.id + 'deleteKey'" persistent max-width="290">
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
            Blabla
            <v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialog = false">Annuler</v-btn>
				<!-- <v-btn @click="editAccount()">Modifier</v-btn> -->
			</v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DialogEditOperation',

    props: {
        item: Object, // L'objet représentant une opération
    },

    data() {
        return {
            dialog: false, // Le model du dialog
        }
    },
}
</script>