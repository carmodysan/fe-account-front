<template>
    <!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition d'une opération -->
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