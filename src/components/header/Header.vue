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

		<!-- Partie notification du site - pas encore implémentée -->
		<v-menu offset-y bottom nudge-bottom="10" left>
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-bind="attrs" v-on="on" style="font-size: 28px" icon class="mr-2" @click="showSnackbar('alertUnavailable')">
					<v-badge value="true" color="error" content="4" overlap>
						<v-icon style="font-size: 28px" color="rgba(255, 255, 255, 0.35)">mdi-bell-outline</v-icon>
					</v-badge>
				</v-btn>
			</template>
		</v-menu>

		<!-- Partie message du site - pas encore implémentée -->
		<v-menu max-width="280" offset-y bottom nudge-bottom="10" left>
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-bind="attrs" v-on="on" style="font-size: 28px" icon class="mr-2" @click="showSnackbar('alertUnavailable')">
					<v-badge value="true" color="warning" content="5" overlap>
						<v-icon style="font-size: 28px" :color="config.color.light.iconColor">mdi-email-outline</v-icon>
					</v-badge>
				</v-btn>
			</template>
		</v-menu>
	</v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import config from '../../config/index';

export default {
	name: 'Header',

	data: () => ({
		config,
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
		}),
	},
};
</script>

<style src="./Header.scss" lang="scss"></style>
