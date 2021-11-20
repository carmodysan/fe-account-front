<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<div class="text-h3 mb-6 text-center">Les comptes de {{ user.name }} et {{ user.id }}</div>
                <div class="text-h3 mb-6 text-center" v-if="monthly_accounts_items == 0">
					<v-btn fab dark large><v-icon>mdi-text-box-plus-outline</v-icon></v-btn>
				</div>
				<div class="text-h3 mb-6 text-center" v-else>Mois {{ monthly_accounts_items }} {{ user.monthlyAccounts }}</div>
			</v-row>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
// TODO Créer les composants pour un affichage correct de tous les monthlyAccounts
import { mapGetters } from "vuex";
import axios from 'axios';
export default {
	name: "Dashboard",

    data: () => ({
		monthly_accounts: null,
		monthly_accounts_items: 0,
		ma: {
			year: 2021,
			month: 1 
		}
	}),

    methods: {
		/*async getMonthlyAccounts() {
			await axios
				.get("/monthly_accounts")
				.then((response) => {
					this.monthly_accounts = response.data["hydra:member"];
				})
				.finally(() => {

				});
		},*/

		async createMA() {
			let response = await axios.post("/monthly_accounts", this.ma).catch((e) => {
				console.log('error : ' + e)
			})
			console.log(response)
		}
	},

	computed: {
		...mapGetters({
			user: "auth/getUser",
		}),
	},

	created() {
		//this.getMonthlyAccounts()
		this.monthly_accounts_items = this.user.monthlyAccounts.length
	}
};
</script>
