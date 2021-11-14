<template>
	<v-app>
		<v-container fluid>
			<MenuMobile />
			<MenuDesktop />
			<v-overlay :value="isLoading" :absolute="absolute" z-index="10">
				<v-progress-circular indeterminate size="64"></v-progress-circular>
			</v-overlay>
			<router-view />
		</v-container>
	</v-app>
</template>

<style scoped></style>

<script>
import MenuDesktop from "./MenuDesktop";
import MenuMobile from './MenuMobile';
import { mapGetters } from "vuex";

export default {
	name: "App",

	data: () => ({
		absolute: true,
	}),

	components: {
		MenuDesktop,
		MenuMobile,
	},

	computed: {
		...mapGetters({
			isLoading: "getLoading",
		}),
	},
};
</script>
