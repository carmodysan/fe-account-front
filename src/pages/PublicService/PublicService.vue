<template>
	<v-container fluid>
		<div class="public-service">
			<!-- Partie titre -->
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
				<h1 class="page-title">Service public</h1>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on" :to="{ name: 'Configuration' }" color="secondary" class="text-capitalize button-shadow mr-1">Configuration</v-btn>
					</template>
				</v-menu>
			</v-row>

			<!-- Partie affichage -->
			<v-row>
				<v-col cols="12">
					<v-card class="mx-1 mb-1">
						<v-card-title class="pa-6 pb-6"><p>Salaire</p></v-card-title>
						<v-card-text class="pa-6 pt-0"> </v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
export default {
	name: 'PublicService',

	data() {
		return {
			formSalary: {
				ifse: 0,
				primePoint: 0,
				compensCSG: 0,
			},
		};
	},
};
</script>
