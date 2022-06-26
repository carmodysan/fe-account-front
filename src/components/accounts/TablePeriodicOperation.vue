<template>
<!-- 
	Ce composant peut être utilisé de deux façons : 
		* Dans la vue globale des opérations périodiques avec le props config à true (cela permet d'afficher les boutons create/edit/delete)
		* Dans la vue globale des opérations d'un compte mensuel  avec le props config à false (cela permet d'afficher le bouton add) 
-->
	<v-card class="mx-1 mb-1">
		<v-card-title class="pa-6 pb-6">
			<p>Liste des opérations périodiques</p>
			<v-spacer></v-spacer>
			<!-- Partie création d'une opération -->
			<div v-if="config">
				<DialogCreatePeriodicOperation v-bind:authorId="user.id" />
			</div>
			<div v-if="!config">
				<v-btn color="secondary" class="text-capitalize button-shadow mr-1" @click="addAllPeriodicOperationsToOperationsInStore()">
					<v-icon class="mr-2">mdi-expand-all</v-icon>Ajouter toutes les opérations
				</v-btn>
			</div>
		</v-card-title>
		<v-card-text class="pa-6 pt-0 mb-1">
			<v-skeleton-loader v-if="isPeriodicOperationsRetrieving" type="table"></v-skeleton-loader>
			<v-data-table v-else disable-pagination hide-default-footer :headers="headers" :items="periodicOperations" item-key="id">
				<!-- Affichage de la catégory de l'opération -->
				<template v-slot:[`item.category`]="{ item }">
					{{ displayOperationCategory(item.category) }}
				</template>

				<!-- Affichage des crédits et débit dans un format plus user friendly -->
				<template v-slot:[`item.debit`]="{ item }">
					{{ item.debit == 0 ? '' : item.debit | formatCurrencyNumber }}
				</template>
				<template v-slot:[`item.credit`]="{ item }">
					{{ item.credit == 0 ? '' : item.credit | formatCurrencyNumber }}
				</template>

				<!-- Affichage des actions -->
				<template v-slot:[`item.actions`]="{ item }">
					<v-row class="d-flex justify-end mr-2">
						<!-- Partie édition du compte -->
						<div v-if="config">
							<DialogEditPeriodicOperation v-bind:item="item" />
						</div>

						<!-- Partie suppression du compte -->
						<div v-if="config">
							<DialogDeletePeriodicOperation v-bind:item="item" />
						</div>

						<!-- Partie ajout du compte -->
						<div v-if="!config">
							<v-tooltip bottom color="primary">
								<template #activator="tooltipAddActivator">
									<v-btn v-on="tooltipAddActivator.on" @click="addPeriodicOperationToOperations(item)" fab outlined elevation="2" small class="mx-2" color="primary">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Ajouter</span>
							</v-tooltip>
						</div>
					</v-row>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DialogCreatePeriodicOperation from '../../components/accounts/DialogCreatePeriodicOperation';
import DialogDeletePeriodicOperation from '../../components/accounts/DialogDeletePeriodicOperation';
import DialogEditPeriodicOperation from '../../components/accounts/DialogEditPeriodicOperation';

import formAccountHelper from '../../config/formAccountHelper';

export default {
	name: 'TablePeriodicOperation',

	components: {
		DialogCreatePeriodicOperation,
		DialogDeletePeriodicOperation,
		DialogEditPeriodicOperation,
	},

	props: {
		config: Boolean,
	},

	data() {
		return {};
	},

	computed: {
		...mapGetters({
			// Partie utilisateur
			user: 'auth/getUser',

			isPeriodicOperationsRetrieving: 'periodicOperation/isPeriodicOperationsRetrieving', // Récupère l'état de la récupération des opérations périodiques
			periodicOperations: 'periodicOperation/getPeriodicOperations', // Récupère les opérations périodiques
		}),

		/**
		 * Les en-têtes du tableau des opérations
		 */
		headers() {
			return [
				{ text: 'Jour du mois', align: 'start', value: 'dayOfMonth' },
				{ text: 'Catégorie', sortable: false, value: 'category' },
				{ text: 'Libellé', sortable: false, value: 'description' },
				{ text: 'Débit', sortable: false, value: 'debit' },
				{ text: 'Crédit', sortable: false, value: 'credit' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
		},
	},

	methods: {
        ...mapActions({
            addAllPeriodicOperationsToOperationsInStore: 'periodicOperation/addAllPeriodicOperationsToOperations', // Ajoute l'opération périodique à la liste des opérations
            addPeriodicOperationToOperationsInStore: 'periodicOperation/addPeriodicOperationToOperations', // Ajoute l'opération périodique à la liste des opérations
            retrievePeriodicOperationsInStore: 'periodicOperation/retrievePeriodicOperations', // Récupère les opérations périodiques du store
        }),

		/**
		 * Affiche le texte de la catégorie
		 */
		displayOperationCategory(categoryValue) {
			const category = formAccountHelper.formOperationSelect.categories.find(({ value }) => value === categoryValue);
			if (category) return category.text;
			return '';
		},

        /**
         * Ajoute une opération périodique à la liste des opérations en cours
         */
        addPeriodicOperationToOperations(periodicOperation) {
            this.addPeriodicOperationToOperationsInStore({operation: periodicOperation, multiple: false});
			this.$emit('input', false); // On fait fermer le dialog parent
		},

		/**
		 * Ajoute toutes opérations périodiques à la liste des opérations en cours
		 */
		addAllPeriodicOperationsToOperations() {
			this.addAllPeriodicOperationsToOperations();
			this.$emit('input', false); // On fait fermer le dialog parent (ne fonctionne pas... ?)
		}
	},

    mounted() {
        this.retrievePeriodicOperationsInStore(this.user.id);
    }
};
</script>
