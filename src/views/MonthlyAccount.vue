<template>
	<v-container fill-height fluid>
		<!-- Quand il n'y a pas de compte mensuel de créé -->
		<v-row v-if="user.monthlyAccounts.length == 0" align="center" justify="center">
			<div v-if="!isFirstMACreating">
				<v-btn fab dark large @click="createFirstMA"><v-icon>mdi-text-box-plus-outline</v-icon></v-btn>
			</div>
			<div v-else>
				<v-row class="fill-height" align-content="center" justify="center">
					<v-col class="text-subtitle-1 text-center" cols="12"> Creating monthly accounts...</v-col>
					<v-col cols="6">
						<v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
					</v-col>
				</v-row>
			</div>
		</v-row>

		<!-- Si un ou plusieurs comptes mensuels existent déjà -->
		<v-row v-else align="center" justify="center" class="d-flex flex-column">
			<div v-if="isMALoading">
				<v-row class="fill-height" align-content="center" justify="center">
					<v-col class="text-subtitle-1 text-center" cols="12"> Loading monthly accounts...</v-col>
					<v-col cols="6">
						<v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
					</v-col>
				</v-row>
			</div>
			<div v-else>
				<v-row>
					<v-col cols="12">
						<v-card v-for="(allMAByYear, year) in allMA" v-bind:key="year">
							<v-card-actions>
								<v-btn color="orange lighten-2" text> {{ year }} </v-btn>

								<v-spacer></v-spacer>

								<v-btn icon @click="show = !show">
									<v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
								</v-btn>
							</v-card-actions>

							<v-expand-transition>
								<div v-show="show">
									<v-divider></v-divider>

									<v-card-text>
										<v-container fluid>
											<v-row dense>
												<v-col v-for="ma in allMAByYear" :key="ma.month" :cols="maCardCols">
													<v-card class="my-4">
														<v-img src="../assets/images/card_11.jpg" width="300" height="200"></v-img>
														<v-card-title> {{ ma.month | formatMonth }} </v-card-title>
														<v-card-subtitle> {{ ma.operations.length }} operations </v-card-subtitle>
														<v-divider></v-divider>
														<v-card-actions>
															<v-btn link :to="{ name: 'operations-list', params: { slug: ma.slug, maId: ma.id } }">Go</v-btn>
														</v-card-actions>
													</v-card>
												</v-col>
											</v-row>
										</v-container>
									</v-card-text>
								</div>
							</v-expand-transition>
						</v-card>
					</v-col>
				</v-row>
			</div>
		</v-row>
	</v-container>
</template>

<style lang="sass" scoped>
$progress-circular-overlay-transition: all .1s ease-in-out !default
</style>

<script>
// TODO Créer les composants pour un affichage correct de tous les monthlyAccounts
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
	name: 'Dashboard',

	data: () => ({
		absolute: true,
		isFirstMACreating: false,
		isMALoading: false,
		allMA: {},
		show: true,
	}),

	methods: {
		...mapActions({
			reload: 'auth/reloadUser',
		}),

		async getMonthlyAccounts() {
			await axios
				.get('/monthly_accounts')
				.then((response) => {
					this.monthly_accounts = response.data['hydra:member'];
				})
				.finally(() => {});
		},

		/**
		 * Fonction appelée si aucun compte mensuel (MA) existe.
		 * Récupère l'année courante et créé les 12 comptes mensuels de l'année
		 */
		async createFirstMA() {
			// On active le loader, il ne sera désactiver que quand maItemsCount aura changé (grâce au watch)
			this.isFirstMACreating = true;

			// On récupère l'année courante
			const d = new Date();
			let year = d.getFullYear();

			try {
				for (let month = 1; month <= 12; month++) {
					const element = '{"year": ' + year + ', "month": ' + month + '}';
					let ma = JSON.parse(element);
					await axios.post('/monthly_accounts', ma).finally(() => {
						console.log(element + ' created.');
					});
				}
			} catch (error) {
				// TODO Gestion de l'exception
			} finally {
				await this.reload();
			}
		},

		async getMAItems(isFirst) {
			if (!isFirst) this.isFirstMACreating = false; // On désactive le loader s'il était activé
			this.isMALoading = true;

			// --> Création du tableau à deux dimensions [year][ma, ma2, ma3, ...] <-- //
			let year = [];
			let currentYear = 0;
			// Création d'un tableau multi dimension dont la première dimension correspond à l'année
			for (let index = 0; index < this.user.monthlyAccounts.length; index++) {
				const ma = this.user.monthlyAccounts[index];
				if (currentYear != ma.year) {
					if (year.length > 0) {
						this.allMA[currentYear.toString()] = year;
					}
					currentYear = ma.year;
				}
				year.push(ma);
			}
			// Après la boucle on inscrit le dernier tableau d'élément non couvert par la boucle
			if (year.length > 0) {
				console.log('le tableau year a plus de 0 élément : ' + year.length);
				this.allMA[currentYear.toString()] = year;
			}
			// --> Fin de création du tableau <-- //

			this.isMALoading = false;
		},
	},

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),

		maItemsCount() {
			return this.user.monthlyAccounts.length;
		},

		maCardCols() {
			switch (this.$vuetify.breakpoint.name) {
				case 'xs':
					return 12;
				case 'sm':
					return 4;
				case 'md':
					return 2;
				case 'lg':
					return 2;
				case 'xl':
					return 2;
				default:
					return 2;
			}
		},
	},

	watch: {
		maItemsCount() {
			this.getMAItems(true);
		},
	},

	created() {
		if (this.user.monthlyAccounts.length > 0) {
			this.getMAItems(false);
		}
	},
};
</script>
