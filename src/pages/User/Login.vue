<template>
	<v-container fluid>
		<v-row no-gutters>
			<!-- Partie gauche de la page de Login -->
			<v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
				<div class="d-flex">
					<v-img src="@/assets/logo.svg" contain></v-img>
					<p>FacilEpargne</p>
					<h5><i>Le site qui facilite la gestion de vos comptes !</i></h5>
				</div>
			</v-col>

			<!-- Partie droite de la page de Login -->
			<v-col cols="12" lg="5" class="login-part d-flex align-center justify-center">
				<v-row no-gutters class="align-start">
					<!-- Partie Login et Register en 2 onglets -->
					<v-col cols="12" class="login-part d-flex align-center justify-center flex-column">
						<div class="login-wrapper pt-md-4 pt-0">
							<v-tabs grow>
								<v-tabs-slider></v-tabs-slider>
								<v-tab href="#tab-login">Login</v-tab>
								<v-tab href="#tab-newUser">Register</v-tab>

								<!-- Onglet Login -->
								<v-tab-item :value="'tab-login'">
									<v-form>
										<v-container>
											<v-row>
												<v-col>
													<p class="login-slogan display-2 text-center font-weight-medium my-10">Se connecter</p>
													<v-btn
														height="45"
														block
														color="white"
														elevation="0"
														class="google text-capitalize"
														@click="
															alertLoginText = 'Cette fonctionnalité n\'est pas encore disponible';
															alertLoginColor = 'info';
															alertLoginBtnColor = 'blue darken-4';
															alertLogin = true;
														"
													>
														<v-img src="@/assets/google.svg" max-width="30" class="mr-4"></v-img>
														Avec Google
													</v-btn>
													<v-col cols="12" class="d-flex align-center my-8">
														<v-divider></v-divider>
														<span class="px-5"> ou </span>
														<v-divider></v-divider>
													</v-col>
													<v-form @submit.prevent="submitLogin">
														<v-col>
															<v-text-field v-model="formLogin.email" :rules="emailRules" label="Adresse mail" required></v-text-field>
															<v-text-field
																v-model="formLogin.password"
																:rules="passwordRules"
																type="password"
																label="Mot de passe"
																hint="Au moins 8 caractères"
																required
															></v-text-field>
														</v-col>
														<v-col class="d-flex flex-row-reverse">
															<v-btn text color="primary" small>Mot de passe oublié ?</v-btn>
														</v-col>
														<v-col class="d-flex">
															<v-btn
																class="text-capitalize"
																large
																block
																color="primary"
																:disabled="formLogin.password.length === 0 || formLogin.email.length === 0"
																type="submit"
															>
																Se connecter
															</v-btn>
														</v-col>
													</v-form>
												</v-col>
											</v-row>
										</v-container>
									</v-form>
								</v-tab-item>
							</v-tabs>
						</div>
					</v-col>

					<!-- Le footer du Login -->
					<v-col cols="12" class="d-flex justify-center">
						<v-footer>
							<div class="primary--text">© 2022 <a href="https://www.facilepargne.fr/" class="text-decoration-none">FacilEpargne</a>. All rights reserved.</div>
						</v-footer>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default {
	name: 'LoginRegister',

	metaInfo: {
		title: 'Connexion',
	},

	data: () => ({
		// Partie Alerte
		alertLogin: false,
		alertLoginColor: '',
		alertLoginBtnColor: '',
		alertLoginText: '',

		// Partie formulaire Login
		formLogin: {
			email: '',
			password: '',
		},

		// Partie formulaire commun : Rules
		emailRules: [(v) => !!v || "L'e-mail est obligatoire", (v) => /.+@.+\..+/.test(v) || "L'e-mail doit être valide"],
		passwordRules: [(v) => !!v || 'Le mot de passe est obligatoire', (v) => (v && v.length >= 8) || 'Le mot de passe doit contenir au moins 8 caractères'],
	}),

	methods: {
		...mapActions({
			login: 'auth/login',
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
		}),

		async submitLogin() {
			await this.login(this.formLogin)
				.then(() => {
					if (this.user) {
						this.showSnackbar({ name: 'alertWelcomeUser', text: `Bienvenue ${this.user.email}` }); // Affichage d'un message de bienvenue à l'utilisateur
					}
					this.$router.replace({ name: 'Home' });
				})
				.catch((e) => {
					if (e.response && e.response.status) {
						// Gestion d'un 401 : non authorisé (invalid credentials)
						if (e.response.status == 401) {
							this.showSnackbar({ name: 'alertLogin401' });
						} else {
							// Toutes les autres erreurs
							this.showSnackbar({ name: 'alertLoginError' });
						}
					}
				});
		},
	},

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),
	},
};
</script>

<style src="./Login.scss" lang="scss" />
