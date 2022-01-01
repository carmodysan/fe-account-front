<template>
    <!-- Ce composant représente un bouton qui ouvre une fenêtre modale dans laquelle il y a un formulaire d'édition d'une opération -->
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
            <v-card-title>Modification d'une opération</v-card-title>
            <v-card-text>
                <v-col cols="12" class="pb-0">
						<v-menu ref="menuCreate" v-model="menuCreateDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="item.dateOp"
									label="Choisissez une date"
									prepend-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker v-model="item.dateOp" no-title scrollable @input="menuCreateDatePicker = false"> </v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-select
							v-model="item.category"
							:items="helper.formOperationSelect.categories"
							:rules="helper.formRules.category"
							label="Catégorie de l'opération"
							persistent-hint
							required
						></v-select>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="item.description" :rules="helper.formRules.accountName" label="Description" required></v-text-field>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="item.credit" :rules="helper.formRules.number" label="Crédit (€)" required></v-text-field>
					</v-col>
					<v-col cols="12" class="pt-0 pb-0">
						<v-text-field v-model="item.debit" :rules="helper.formRules.number" label="Débit (€)" required></v-text-field>
					</v-col>
                    <v-col cols="12" class="pt-0">
                        <v-checkbox v-model="item.checked" label="Pointée ?"></v-checkbox>
                    </v-col>
            </v-card-text>
            <v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click="dialog = false">Annuler</v-btn>
				<v-btn color="success" @click="editOperation()">Modifier</v-btn>
			</v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import formHelper from '../../../config/formAccountHelper';

export default {
    name: 'DialogEditOperation',

    props: {
        item: Object, // L'objet représentant une opération
    },

    data() {
        return {
            dialog: false, // Le model du dialog

            menuCreateDatePicker: false,

            // Helper formulaire (règles, listes...)
			helper: formHelper,
        }
    },

    methods: {
        ...mapActions({
            editOperationInStore: 'currentAccountOperation/editOperation', // Modifie l'opération dans le store
        }),

        /**
         * Modifie l'opération
         */
        editOperation() {
            this.item.debit = this.item.debit.toString(); // l'API a besoin de string pour les nombres décimaux
			this.item.credit = this.item.credit.toString(); // l'API a besoin de string pour les nombres décimaux
            this.editOperationInStore(this.item); // On envoie les données de l'opération en BDD via l'API.
            this.dialog = false
        }
    }
}
</script>