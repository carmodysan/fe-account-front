<template>
	<v-dialog v-model="dialogCreateEchelon" persistent max-width="290">
		<template v-slot:activator="{ on, attrs }">
			<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">
				<v-icon class="mr-2">mdi-plus</v-icon>
				Nouveau échelon
			</v-btn>
		</template>
		<v-card>
			<v-card-title>Création d'un échelon</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="formCreateEchelon.echelon" type="number" min="1" max="20" label="Echelon" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="formCreateEchelon.monthDuration" type="number" min="1" max="100" label="Durée en mois" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="formCreateEchelon.grossIndex" type="number" min="1" max="2000" label="Indice brut" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-text-field v-model="formCreateEchelon.increaseIndex" type="number" min="1" max="1500" label="Indice majoré" required></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-select v-model="rank" :items="ranks" item-text="labelLong" item-value="id" label="Grade" return-object></v-select>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialogCreateEchelon = false" color="secondary">Annuler</v-btn>
				<v-btn @click="createEchelon()" color="primary">Créer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'DialogCreateEchelon',

	data: () => ({
		dialogCreateEchelon: false,
		rank: {
			labelLong: 'grade',
			id: 'id_grade'
		},

		// Partie formulaire
		formCreateEchelon: {
			echelon: 1,
			monthDuration: 1,
            grossIndex: 1,
            increaseIndex: 1,
			rank: '',
		},
	}),

	methods: {
		...mapActions({
			createEchelonInStore: 'publicService/createEchelon', // Envoie la création du grade dans le store et lance le rafraichissement de la liste des grades.
		}),

		/**
		 * Création d'un compte
		 */
		createEchelon() {
			this.dialogCreateEchelon = false; // On peut fermer la fenêtre modale
			this.formCreateEchelon.echelon = parseInt(this.formCreateEchelon.echelon); // On parse en int l'échelon.
			this.formCreateEchelon.monthDuration = parseInt(this.formCreateEchelon.monthDuration); // On parse en int la durée du mois.
			this.formCreateEchelon.grossIndex = parseInt(this.formCreateEchelon.grossIndex); // On parse en int l'indice brut.
			this.formCreateEchelon.increaseIndex = parseInt(this.formCreateEchelon.increaseIndex); // On parse en int l'indice majoré.
			this.formCreateEchelon.rank = '/api/ref_ranks/' + this.rank.id; // L'identifiant du grade
			this.createEchelonInStore(this.formCreateEchelon); // On lance la création du grade en l'envoyant à l'API.
		},
	},

	computed: {
		...mapGetters({
			ranks: 'publicService/getRanks', // On récupère les grades
		})
	}
};
</script>