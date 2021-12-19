<template>
	<v-app>
		<v-container fill-height fluid>
			<MenuMobile />
			<MenuDesktop />
			<v-overlay :value="isLoading" :absolute="absolute" z-index="10">
				<v-progress-circular indeterminate size="64"></v-progress-circular>
			</v-overlay>
			<v-main>
				<div class="text-center">
					<v-snackbar :value="alertLogout" top timeout="3000">
						Votre session a expirée ! Merci de vous authentifier de nouveau.
					</v-snackbar>
				</div>
				<router-view />
			</v-main>
		</v-container>
	</v-app>
</template>

<style scoped></style>

<script>
import MenuDesktop from './menu/MenuDesktop';
import MenuMobile from './menu/MenuMobile';
import EventBus from '../common/EventBus';
import { mapGetters } from 'vuex';

export default {
	name: 'App',

	data: () => ({
		absolute: true,
		alertLogout: false,
	}),

	components: {
		MenuDesktop,
		MenuMobile,
	},

	computed: {
		...mapGetters({
			isLoading: 'getLoading',
		}),
	},

	methods: {
		logOut() {
			this.$store.dispatch('auth/logout');
			this.alertLogout = true;
			this.$router.push('/login');
		},
	},
	mounted() {
		EventBus.on('logout', () => {
			this.logOut();
		});
	},
	beforeDestroy() {
		EventBus.remove('logout');
	},
};
</script>
