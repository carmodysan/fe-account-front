<template>
	<v-navigation-drawer
		app
		clipped
		v-model="drawerState"
		:mini-variant="!drawerState"
		:width="sidebarWidth"
		:permanent="$vuetify.breakpoint.mdAndUp"
		:temporary="$vuetify.breakpoint.smAndDown"
		:mini-variant-width="sidebarMinWidth"
		:class="{ 'drawer-mini': !drawerState }"
	>
		<!-- Header du menu -->
		<v-list>
			<template v-for="(item, i) in items">
				<!-- Partie titre du menu -->
				<v-row v-if="item.heading" :key="item.heading" align="center">
					<v-col cols="6" class="py-5">
						<span style="padding-left: 32px" class="text-body-1 subheader" :class="item.heading && drawerState ? 'show ' : 'hide'">
							{{ item.heading }}
						</span>
					</v-col>
					<v-col cols="6" class="text-center"> </v-col>
				</v-row>

				<!-- Séparateur -->
				<v-divider v-else-if="item.divider" :key="i" dark class="my-4"></v-divider>

				<!-- Partie sous-item du menu -->
				<v-list-group color="primary" v-else-if="item.children && drawerState" :key="item.title" v-model="item.model" append-icon="">
					<template v-slot:prependIcon>
						<v-icon size="28">mdi-image-filter-none</v-icon>
					</template>
					<template v-slot:activator>
						<v-list-item-content>
							<v-list-item-title class="grey--text">
								{{ item.title }}
							</v-list-item-title>
						</v-list-item-content>
					</template>
					<v-list-item v-for="(child, i) in item.children" :key="i" :to="child.link" link>
						<v-list-item-action v-if="child.icon">
							<v-icon size="">{{ child.icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title class="grey--text">
								{{ child.title }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>

                <!-- Partie item du menu -->
				<v-list-item color="primary" v-else :key="item.text" :href="item.href ? item.href : null" :to=" {name: item.link } " link>
					<v-list-item-action>
						<v-icon size="28" :color="item.color ? item.color : ''">{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title class="grey--text" link>
							{{ item.title }}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'Sidebar',

	data: () => ({
		// Partie commune
		sidebarWidth: 240,
		sidebarMinWidth: 96,

		// Menu
		items: [
			{ title: 'Accueil', icon: 'mdi-home', link: 'Home' },
			{ title: 'Tableau de bord', icon: 'mdi-desktop-mac-dashboard', link: 'Dashboard' },
			{ title: 'Comptes', icon: 'mdi-cash-multiple', link: 'Accounts' },
			{ title: 'Service public', icon: 'mdi-chair-rolling', link: 'PublicService' },
			{
				title: 'UI Elements',
				icon: 'mdi-image-filter-none',
				link: 'Empty',
				model: false,
				children: [
					{ title: 'Icons', icon: 'mdi-circle-small', link: 'Empty' },
					{ title: 'Charts', icon: 'mdi-circle-small', link: 'Empty' },
					{ title: 'Maps', icon: 'mdi-circle-small', link: 'Empty' },
				],
			},
			{ divider: true },
			{ heading: 'HELP' },
			{ title: 'Library', icon: 'mdi-book-variant-multiple', href: 'https://flatlogic.com/templates' },
			{ title: 'Support', icon: 'mdi-forum', href: 'https://flatlogic.com/forum/' },
			{ title: 'FAQ', icon: 'mdi-help-circle-outline', href: 'https://flatlogic.com/templates/vue-material-template' },
			{ divider: true },
			{ heading: 'PROJECTS' },
			{ title: 'My recent', icon: 'mdi-circle-medium', color: 'warning' },
			{ title: 'Starred', icon: 'mdi-circle-medium', color: 'primary' },
			{ title: 'Background', icon: 'mdi-circle-medium', color: 'error' },
		],
	}),

	computed: {
		...mapGetters({
			drawerState: 'getDrawerState', // Récupère l'état du drawer (sidebar) dans le store
		}),
	},
};
</script>

<style src="./Sidebar.scss" lang="scss"></style>
