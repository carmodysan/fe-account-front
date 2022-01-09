<template>
	<v-dialog v-model="dialogCreateRank" persistent max-width="290">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">
				<v-icon class="mr-2">mdi-plus</v-icon>
				Nouveau grade
			</v-btn>
		</template>
		<v-card>
			<v-card-title>Création d'un grade</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="formCreateRank.level" type="number" min="1" max="3" label="Niveau du grade (1, 2, 3, ...)" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="formCreateRank.labelLong" label="Nom du grade" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="formCreateRank.labelShort" label="Nom abrégé du grade" required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialogCreateRank = false" color="secondary">Annuler</v-btn>
				<v-btn @click="createRank()" color="primary">Créer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'DialogCreateRank',

	data: () => ({
		dialogCreateRank: false,

		// Partie formulaire
		formCreateRank: {
			level: 0,
			labelLong: '',
            labelShort: '',
		},
	}),

	methods: {
		...mapActions({
			createRankInStore: 'publicService/createRank', // Envoie la création du grade dans le store et lance le rafraichissement de la liste des grades.
		}),

		/**
		 * Création d'un compte
		 */
		createRank() {
			this.dialogCreateRank = false; // On peut fermer la fenêtre modale
			this.formCreateRank.level = parseInt(this.formCreateRank.level); // On parse en int le niveau du grade.
			this.createRankInStore(this.formCreateRank); // On lance la création du grade en l'envoyant à l'API.
		},
	},
};
</script>