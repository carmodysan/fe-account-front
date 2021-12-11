<template>
	<v-container>
		<v-row align="center" justify="center">
			<div v-if="isAccountsLoading">
				<v-skeleton-loader class="mx-auto" min-width="300" type="card-heading, table"></v-skeleton-loader>
			</div>
			<div v-else>
				<!-- Création d'un compte en banque -->
				<v-dialog max-width="300" v-model="formDialog" persistent>
					<template v-slot:activator="{ on, attrs }">
						<v-btn fab dark large v-bind="attrs" v-on="on"><v-icon>mdi-text-box-plus-outline</v-icon></v-btn>
					</template>
					<v-card>
						<v-card-title>
							<span class="text-h5">Créer un compte</span>
						</v-card-title>
						<v-form ref="form" v-model="formCreateValid" lazy-validation class="mx-3">
							<!-- Bank -->
							<v-text-field v-model="form.bank" :rules="formBankRules" label="Banque" required></v-text-field>
							<!-- Category -->
							<v-text-field v-model="form.category" :rules="formCategoryRules" label="Catégorie" required></v-text-field>
							<!-- Actions -->
							<v-btn :disabled="!formCreateValid" color="failure" class="mr-4" @click="formDialog = false">Annuler</v-btn>
							<v-btn
								:disabled="!formCreateValid"
								color="success"
								class="mr-4"
								@click="
									formDialog = false;
									submitAccount();
								"
							>
								Envoyer
							</v-btn>
						</v-form>
					</v-card>
				</v-dialog>
				<div v-if="accounts.length == 0">
					<p>Vous n'avez aucun compte de créé.</p>
				</div>
				<div v-else>
					<v-card class="mb-2">
						<v-card-title>Tous les comptes</v-card-title>
						<v-card-text>
							<v-data-table disable-pagination hide-default-footer :headers="headers" :items="accounts" item-key="id">
								<template v-slot:[`item.actions`]="{ item }">
									<!-- Partie visualisation du compte -->
									<v-hover v-slot="{ hover }">
										<v-icon small class="mr-1" @click="goToAccountDetails(item.id, item.slug)" :color="hover ? 'green' : 'green darken-4'">mdi-eye</v-icon>
									</v-hover>
									<!-- Partie édition du compte -->
									<v-dialog max-width="300" v-model="editDialog">
										<template v-slot:activator="{ on, attrs }">
											<v-hover v-slot="{ hover }">
												<v-icon small class="mr-1" v-bind="attrs" @click="getAccount(item.id)" v-on="on" :color="hover ? 'blue' : 'dark grey'">mdi-pencil</v-icon>
											</v-hover>
										</template>
										<v-card>
											<v-card-title>
												<span class="text-h5">Modifier le compte</span>
											</v-card-title>
											<v-form ref="form" v-model="formEditValid" lazy-validation class="mx-3">
												<v-text-field v-model="formEdit.bank" :rules="formBankRules" label="Banque" required></v-text-field>
												<v-text-field v-model="formEdit.category" :rules="formCategoryRules" label="Catégorie" required></v-text-field>
												<v-btn :disabled="!formEditValid" color="failure" class="mr-4" @click="editDialog = false">Annuler</v-btn>
												<v-btn
													:disabled="!formEditValid"
													color="success"
													class="mr-4"
													@click="
														editDialog = false;
														editAccount();
													"
												>
													Modifier
												</v-btn>
											</v-form>
										</v-card>
									</v-dialog>
									<!-- Partie suppression du compte -->
									<v-dialog max-width="300" v-model="deleteDialog">
										<template v-slot:activator="{ on, attrs }">
											<v-hover v-slot="{ hover }">
												<v-icon small v-bind="attrs" v-on="on" :color="hover ? 'red' : 'dark grey'">mdi-delete</v-icon>
											</v-hover>
										</template>
										<v-card>
											<v-card-title>
												<span class="text-h5">Attention !</span>
											</v-card-title>
											<v-card-text>
												<p>Voulez-vous vraiment supprimer ce compte ?</p>
												<p><i>Attention, cela va supprimer toutes les opérations associées à ce compte...</i></p>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn color="red" @click="deleteDialog = false">Annuler</v-btn>
												<v-btn
													color="success"
													@click="
														deleteDialog = false;
														deleteAccount(item.id);
													"
													>Supprimer</v-btn
												>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</template>
							</v-data-table>
						</v-card-text>
					</v-card>
				</div>
			</div>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import AccountsDataService from '../../services/AccountsDataService';
import { mapGetters } from 'vuex';

export default {
	name: 'accounts',

	data: () => ({
		isAccountsLoading: false,
		accounts: [],

		// Creation form part
		form: {
			bank: '',
			category: '',
		},
		formDialog: false,
		formCreateValid: true,
		formCategoryRules: [(v) => !!v || 'La catégorie est obligatoire'],
		formBankRules: [(v) => !!v || 'La banque est obligatoire'],

		deleteDialog: false,

		formEdit: {
			bank: '',
			category: '',
		},
		formEditValid: true,
		editDialog: false,
	}),

	methods: {
		/**
		 * Récupère tous les comptes de l'utilisateur courant
		 */
		retrieveAccounts() {
			this.isAccountsLoading = true;
			AccountsDataService.getAll(this.user.id)
				.then((response) => {
					this.accounts = response.data['hydra:member'];
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.isAccountsLoading = false;
				});
		},

		/**
		 * Récupère un compte basé sur l'id donné en paramètre
		 */
		getAccount(id) {
			AccountsDataService.get(id)
				.then((response) => {
					this.formEdit = response.data;
				})
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {});
		},

		/**
		 * Envoie la création d'un compte
		 */
		async submitAccount() {
			this.form.authorId = this.user.id;
			await AccountsDataService.create(this.form)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.retrieveAccounts();
				});
		},

		/**
		 * Supprime le compte
		 */
		async deleteAccount(id) {
			await AccountsDataService.delete(id)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.retrieveAccounts();
				});
		},

        /**
         * Modifie le compte
         */
		async editAccount() {
			await AccountsDataService.update(this.formEdit.id, this.formEdit)
				.catch((e) => {
					console.log(e);
				})
				.finally(() => {
					this.retrieveAccounts();
				});
		},

        /**
         * Appelle la page pour consulter le compte
         */
        goToAccountDetails(id, slug) {
            this.$router.push({ name: 'account-details', params: { slug: slug, accountId: id } });
        }
	},

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),

		/**
		 * Renvoie les colonnes du tableau des comptes
		 */
		headers() {
			return [
				{ text: 'Banque', align: 'start', value: 'bank' },
				{ text: 'Catégorie', value: 'category' },
				{ text: 'Solde', value: 'balance', sortable: false },
				{ text: 'Actions', value: 'actions', align: 'center', sortable: false },
			];
		},
	},

	mounted() {
		this.retrieveAccounts();
	},
};
</script>
