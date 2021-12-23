<template>
	<v-app-bar height="64" fixed color="primary" dark class="main-header">
		<v-btn icon class="mx-1" @click.stop="toggleDrawer">
			<template v-if="drawerState">
				<v-icon style="font-size: 28px">mdi-arrow-left</v-icon>
			</template>
			<template v-else>
				<v-icon style="font-size: 28px">mdi-menu</v-icon>
			</template>
		</v-btn>

		<v-toolbar-title>FacilEpargne</v-toolbar-title>
		<v-spacer></v-spacer>

		<!-- Partie recherche du header - pas en implémentée -->
		<Search />

		<!-- Partie notification du header - pas encore implémentée -->
		<v-menu offset-y bottom nudge-bottom="10" left>
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-bind="attrs" v-on="on" style="font-size: 28px" icon class="mr-2" @click="showSnackbar({ name: 'alertUnavailable' })">
					<v-badge value="true" color="error" content="4" overlap>
						<v-icon style="font-size: 28px" color="rgba(255, 255, 255, 0.35)">mdi-bell-outline</v-icon>
					</v-badge>
				</v-btn>
			</template>
		</v-menu>

		<!-- Partie message du header - pas encore implémentée -->
		<v-menu max-width="280" offset-y bottom nudge-bottom="10" left>
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-bind="attrs" v-on="on" style="font-size: 28px" icon class="mr-2" @click="showSnackbar({ name: 'alertUnavailable' })">
					<v-badge value="true" color="warning" content="5" overlap>
						<v-icon style="font-size: 28px" :color="config.color.light.iconColor">mdi-email-outline</v-icon>
					</v-badge>
				</v-btn>
			</template>
		</v-menu>

		<!-- Partie user du header -->
		<v-menu min-width="180" offset-y bottom left nudge-bottom="10">
			<template v-slot:activator="{ on, attrs }">
				<v-btn class="mr-0" icon v-bind="attrs" v-on="on">
					<v-icon style="font-size: 28px" :color="config.color.light.iconColor">mdi-account</v-icon>
				</v-btn>
			</template>
			<v-list>
				<div class="text-h5 grey--text text--darken-3 px-4 pt-4">John Smith</div>
				<div class="subtitle-2 primary--text font-weight-regular px-4">Flatlogic.com</div>
				<v-list-item-group color="primary">
					<v-list-item v-for="(item, i) in account" :key="i" @click="showSnackbar({ name: 'alertUnavailable' })">
						<v-list-item-icon class="mr-4">
							<v-icon :color="item.color" v-text="item.icon"> </v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title :color="config.color.light.textColor" v-text="item.text"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
				<div class="d-flex justify-center my-3">
					<v-btn width="80%" large outlined color="primary" class="text-capitalize" @click="submit_logout">Sign Out </v-btn>
				</div>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import config from '../../config/index';

import Search from '@/components/search/Search';

export default {
	name: 'Header',

	components: { Search },

	data: () => ({
		// Général configuration
		config,

		// User : Quand les pages seront définies, il faudra ajouter :to="item.route" à v-list-item
		account: [
			{ text: 'Profile', icon: 'mdi-account', color: 'textColor' },
			{ text: 'Tasks', icon: 'mdi-thumb-up', color: 'textColor' },
			{ text: 'Messages', icon: 'mdi-flag', color: 'textColor' },
		],
	}),

	computed: {
		...mapGetters({
			drawerState: 'getDrawerState', // Récupère l'état du drawer (sidebar) dans le store
		}),
	},

	methods: {
		...mapActions({
			toggleDrawer: 'toggleDrawer', // Modifie l'état du drawer (sidebar) dans le store
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
			logout: 'auth/logout', // Pour se déconnecter
		}),

		/**
		 * Lance la déconnexion.
		 */
		submit_logout() {
			this.logout();
			this.showSnackbar({name: 'alertLogoutByUser'});
			this.$router.replace({
                name: 'Login'
            })
		}
	},
};
</script>

<style src="./Header.scss" lang="scss"></style>
