<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<div class="text-h3 mb-6 text-center">Les comptes de {{ user.name }} et {{ user.id }}</div>
                {{ monthly_accounts }}
			</v-row>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import { mapGetters } from "vuex";
import axios from 'axios';
export default {
	name: "Dashboard",

    data: () => ({
		monthly_accounts: null,
	}),

    methods: {
		async init() {
			await axios
				.get("/monthly_accounts")
				.then((response) => {
					this.test = response.data["hydra:member"];
				})
				.finally(() => {});
		},
	},

	computed: {
		...mapGetters({
			user: "auth/getUser",
		}),
	},
};
</script>
