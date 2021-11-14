<template>
    <v-navigation-drawer app v-if="!$vuetify.breakpoint.smAndDown">
		<v-list>
			<v-list-item link :to="{ name: 'home'}">
				<v-list-item-icon>
					<v-icon>$feicon</v-icon>
				</v-list-item-icon>
				<v-list-item-title>FacilEpargne</v-list-item-title>
			</v-list-item>
		</v-list>
		<v-divider></v-divider>
		<v-list>
            <v-list-item link :to="{ name: 'login'}" v-if="!isAuthenticated">
				<v-list-item-icon>
					<v-icon>mdi-login</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Se connecter</v-list-item-title>
			</v-list-item>
            <v-list-item link :to="{ name: 'register'}" v-if="!isAuthenticated">
				<v-list-item-icon>
					<v-icon>mdi-account-plus</v-icon>
				</v-list-item-icon>
				<v-list-item-title>S'enregistrer</v-list-item-title>
			</v-list-item>
			<v-list-item link :to="{ name: 'dashboard'}" v-if="isAuthenticated">
				<v-list-item-icon>
					<v-icon>mdi-monitor-dashboard</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Dashboard</v-list-item-title>
			</v-list-item>
			<v-list-item link href="#">
				<v-list-item-icon>
					<v-icon>mdi-cash-multiple</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Comptes</v-list-item-title>
			</v-list-item>
			<v-list-item link href="#">
				<v-list-item-icon>
					<v-icon>mdi-cards-outline</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Magic</v-list-item-title>
			</v-list-item>
		</v-list>
		<template v-slot:append>
		<v-divider v-if="isAuthenticated"></v-divider>
		<v-list>
			<v-list-item link @click="submit_logout" v-if="isAuthenticated">
				<v-list-item-icon>
					<v-icon>mdi-logout</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Se déconnecter</v-list-item-title>
			</v-list-item>
		</v-list>
		</template>
	</v-navigation-drawer>
</template>

<style scoped>

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: "MenuDesktop",

	computed: {
		...mapGetters({
			isAuthenticated: 'auth/isAuthenticated'
		})
	},

	methods: {
		...mapActions({
			logout: 'auth/logout'
		}),

		submit_logout() {
			this.logout()
			this.$router.replace({
                name: 'home'
            })
		}
	}
}
</script>