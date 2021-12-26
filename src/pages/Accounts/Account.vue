<template>
	<v-container fluid>
		<div class="account-page">
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
				<h1 class="page-title">Comptes</h1>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on" color="secondary" class="text-capitalize button-shadow mr-1">Latest Reports</v-btn>
					</template>
				</v-menu>
			</v-row>
		</div>
		Account {{ user.email }}
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'Account',

	computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),
	},
};
</script>

<style src="./Account.scss" lang="scss" />
