<template>
	<v-app>
		<v-container fluid>
			<MenuMobile />
			<MenuDesktop />
			<v-overlay :value="isLoading" :absolute="absolute" z-index="10">
				<v-progress-circular indeterminate size="64"></v-progress-circular>
			</v-overlay>
			<v-main>
				<router-view />
			</v-main>
		</v-container>
	</v-app>
</template>

<style scoped></style>

<script>
import MenuDesktop from "./menu/MenuDesktop";
import MenuMobile from "./menu/MenuMobile";
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
