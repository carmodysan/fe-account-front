<template>
	<v-app>
		<v-container fill-height fluid>
			<v-row align="center" justify="center" class="d-flex flex-column">
				<v-row class="d-flex justify-center">
					<v-card elevation="3" outlined class="px-5 py-3">
						<v-card-title>Se connecter</v-card-title>
						<v-form ref="form" v-model="valid" lazy-validation>
							<v-text-field v-model="form.email" :rules="emailRules" label="E-mail" required></v-text-field>
							<v-text-field v-model="form.password" :rules="passwordRules" type="password" label="Mot de passe" required></v-text-field>
							<v-btn :disabled="!valid" color="success" class="mr-4" @click="submit"> Envoyer </v-btn>
						</v-form>
					</v-card>
				</v-row>
			</v-row>
		</v-container>
	</v-app>
</template>

<style scoped></style>

<script>
import { mapActions } from 'vuex';
export default {
	name: "Login",

	data: () => ({
		valid: true,

		emailRules: [(v) => !!v || "L'e-mail est obligatoire", (v) => /.+@.+\..+/.test(v) || "L'e-mail doit être valide"],

		passwordRules: [(v) => !!v || "Le mot de passe est obligatoire", (v) => (v && v.length >= 8) || "Le mot de passe doit contenir au moins 8 caractères"],
		form: {
			email: "",
			password: "",
		},
	}),

    methods: {
        ...mapActions({
            login: 'auth/login'
        }),

        async submit() {
            console.log('submit')
            await this.login(this.form).finally(() => {
                this.$router.replace({
                    name: 'dashboard',
                })
            })
        }
    }
};
</script>
