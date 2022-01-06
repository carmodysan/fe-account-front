<template>
	<v-container fluid>
		<div>
			<!-- Partie titre -->
			<v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
				<h1 class="page-title">Configuration</h1>
			</v-row>

			<!-- Partie onglets -->
			<v-row>
				<v-tabs vertical>
					<!-- Titre onglet -->
					<v-tab>
						<v-icon left> mdi-cash-multiple </v-icon>
						Comptes
					</v-tab>
					<v-tab>
						<v-icon left> mdi-chair-rolling </v-icon>
						Service publique
					</v-tab>
					<v-tab-item>
						<v-card flat> Blabla </v-card>
					</v-tab-item>
					<v-tab-item>
						<PublicServiceTabItem />
					</v-tab-item>
				</v-tabs>
			</v-row>
		</div>
	</v-container>
</template>

<script>
import PublicServiceTabItem from '../../components/configuration/public-service/TabItem.vue';

export default {
	name: 'Configuration',

	components: {
		PublicServiceTabItem,
	},

	data() {
		return {};
	},
};
</script>
