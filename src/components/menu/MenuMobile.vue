<template>
    <v-app-bar app fixed v-if="$vuetify.breakpoint.xsOnly" hide-on-scroll>
		<v-btn icon :to="{ name: 'home'}">
			<v-icon>$feicon</v-icon>
		</v-btn>
		<v-toolbar-title>FacilEpargne</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-menu>
			<template v-slot:activator="{ on, attrs }">
			<v-btn icon v-bind="attrs" v-on="on">
				<v-icon>mdi-dots-vertical</v-icon>
			</v-btn>
			</template>
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
                <v-list-item link :to="{ name: 'accounts'}" v-if="isAuthenticated">
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
			<v-divider v-if="isAuthenticated"></v-divider>
			<v-list>
				<v-list-item link @click="submit_logout" v-if="isAuthenticated">
					<v-list-item-icon>
						<v-icon>mdi-logout</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Se déconnecter</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>

<style scoped>

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: "MenuMobile",

	// TODO à mettre en place pour faciliter la lecture du code du menu
    data: () => ({
      items: [
        { title: 'Dashboard', icon: 'mdi-monitor-dashboard', href: '/dashboard' },
        { title: 'Account', icon: 'mdi-cash-multiple', href: '/account' },
        { title: 'Magic', icon: 'mdi-cards-outline', href: '/magic' },
      ],
    }),

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