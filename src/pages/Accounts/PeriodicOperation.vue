<template>
    <v-container fluid>
        <div class="account-page">
            <!-- Partie en-tête -->
            <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
				<h1 class="page-title">Opérations récurrentes</h1>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1" :to="{ name: 'CurrentAccount'}">Revenir au compte</v-btn>
					</template>
				</v-menu>
			</v-row>

            <!-- Partie corps de page -->
            <v-row>
                <!-- Partie liste des opérations périodiques de l'utilisateurs -->
				<v-col cols="12">
                    <TablePeriodicOperation config />
					<!-- <v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6">
							<p>Liste des opérations périodiques</p>
							<v-spacer></v-spacer>
							<-- Partie création d'une opération
							<div>
								<DialogCreatePeriodicOperation v-bind:authorId="user.id" />
							</div>
						</v-card-title>
						<v-card-text class="pa-6 pt-0 mb-1">
							<v-skeleton-loader v-if="isPeriodicOperationsRetrieving" type="table"></v-skeleton-loader>
							<v-data-table v-else disable-pagination hide-default-footer :headers="headers" :items="periodicOperations" item-key="id">
								<-- Affichage de la catégory de l'opération 
								<template v-slot:[`item.category`]="{ item }">
									{{ displayOperationCategory(item.category) }}
								</template>

								<-- Affichage des crédits et débit dans un format plus user friendly 
								<template v-slot:[`item.debit`]="{ item }">
									{{ item.debit == 0 ? '' : item.debit | formatCurrencyNumber }}
								</template>
								<template v-slot:[`item.credit`]="{ item }">
									{{ item.credit == 0 ? '' : item.credit | formatCurrencyNumber }}
								</template>

                                <-- Affichage des actions 
								<template v-slot:[`item.actions`]="{ item }">
									<v-row class="d-flex justify-end mr-2">
										<-- Partie édition du compte
										<div>
											<DialogEditPeriodicOperation v-bind:item="item" />
										</div>

										<-- Partie suppression du compte
										<div>
											<DialogDeletePeriodicOperation v-bind:item="item" />
										</div>
									</v-row>
								</template>
							</v-data-table>
						</v-card-text>
					</v-card> -->
				</v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

// import DialogCreatePeriodicOperation from '../../components/accounts/DialogCreatePeriodicOperation';
// import DialogDeletePeriodicOperation from '../../components/accounts/DialogDeletePeriodicOperation';
// import DialogEditPeriodicOperation from '../../components/accounts/DialogEditPeriodicOperation';
import TablePeriodicOperation from '../../components/accounts/TablePeriodicOperation';

// import formAccountHelper from '../../config/formAccountHelper';

export default {
    name: 'PeriodicOperation',

    components: {
        TablePeriodicOperation,
        // DialogCreatePeriodicOperation,
        // DialogDeletePeriodicOperation,
        // DialogEditPeriodicOperation,
    },

    data() {
        return {

        }
    },

    methods: {
        ...mapActions({
            retrievePeriodicOperationsInStore: 'periodicOperation/retrievePeriodicOperations', // Récupère les opérations périodiques du store
        }),

        /**
		 * Affiche le texte de la catégorie
		 */
		// displayOperationCategory(categoryValue) {
		// 	const category = formAccountHelper.formOperationSelect.categories.find(({ value }) => value === categoryValue);
		// 	if (category) return category.text;
		// 	return ''; 
		// }
    },

    computed: {
        ...mapGetters({
            // Partie utilisateur
			user: 'auth/getUser',

        //     isPeriodicOperationsRetrieving: 'periodicOperation/isPeriodicOperationsRetrieving', // Récupère l'état de la récupération des opérations périodiques
		// 	periodicOperations: 'periodicOperation/getPeriodicOperations', // Récupère les opérations périodiques
        }),

        // /**
		//  * Les en-têtes du tableau des opérations
		//  */
		// headers() {
		// 	return [
		// 		{ text: "Jour du mois", align: 'start', value: 'dayOfMonth' },
		// 		{ text: 'Catégorie', sortable: false, value: 'category' },
		// 		{ text: 'Libellé', sortable: false, value: 'description' },
		// 		{ text: 'Débit', sortable: false, value: 'debit' },
		// 		{ text: 'Crédit', sortable: false, value: 'credit' },
		// 		{ text: '', sortable: false, align: 'end', value: 'actions' },
		// 	];
		// },
    },

    mounted() {
        this.retrievePeriodicOperationsInStore(this.user.id);
    }
}
</script>

<style src="./Accounts.scss" lang="scss" />