<template>
	<!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition d'une taux d'intérêts -->
	<v-dialog v-model="dialog" :key="item.id + 'editKey'" persistent max-width="320">
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
			<v-card-title>Modification d'une taux d'intérêts</v-card-title>
			<v-card-text>
				<v-col cols="12" class="pb-0">
					<v-menu ref="menuCreate" v-model="menuStartDateDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
						<template v-slot:activator="{ on, attrs }">
							<v-text-field v-model="item.startDate" label="Choisissez une date de début" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
						</template>
						<v-date-picker v-model="item.startDate" no-title scrollable @input="menuStartDateDatePicker = false"> </v-date-picker>
					</v-menu>
				</v-col>
				<v-col cols="12" class="pb-0">
					<v-menu ref="menuCreate" v-model="menuEndDateDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
						<template v-slot:activator="{ on, attrs }">
							<v-text-field v-model="item.endDate" label="Choisissez une date de début" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
						</template>
						<v-date-picker v-model="item.endDate" no-title scrollable @input="menuEndDateDatePicker = false"> </v-date-picker>
					</v-menu>
				</v-col>
				<v-col cols="12" class="pt-0 pb-0">
					<v-text-field v-model="item.rate" :rules="helper.formRules.number" label="Taux d'intérêts" required></v-text-field>
				</v-col>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialog = false">Annuler</v-btn>
				<v-btn color="success" @click="editInterestRate()">Modifier</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../../config/formAccountHelper';

export default {
	name: 'DialogEditInterestRate',

	props: {
		item: Object, // L'objet représentant un taux d'intérêts
	},

	data() {
		return {
			dialog: false, // Le model du dialog

			menuStartDateDatePicker: false,
			menuEndDateDatePicker: false,

			// Helper formulaire (règles, listes...)
			helper: formHelper,
		};
	},

	methods: {
		...mapActions({
			editInterestRateInStore: 'interestRate/editInterestRate', // Modifie le taux d'intérêts dans le store
		}),

		/**
		 * Modifie le taux d'intérêts
		 */
		editInterestRate() {
			this.item.rate = this.item.rate.toString(); // l'API a besoin de string pour les nombres décimaux
			this.editInterestRateInStore(this.item); // On envoie les données du taux d'intérêts en BDD via l'API.
			this.dialog = false;
		},
	},
};
</script>
