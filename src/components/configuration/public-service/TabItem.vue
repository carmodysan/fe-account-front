<template>
	<v-row>
		<v-col lg="6" cols="12">
			<v-card flat>
				<v-card-title class="pa-6 pb-6 d-flex justify-space-between">
					<p>Grade</p>
					<DialogCreateRank />
				</v-card-title>
				<v-card-text class="pa-6 pt-0">
					<v-row no-gutters class="pb-5" align="center">
						<v-col cols="12">
							<div v-if="isRanksRetrieving">Grades en cours de récupération</div>
							<v-data-table v-else disable-pagination hide-default-footer :headers="ranksHeaders" :items="ranks" item-key="id">
								<!-- Affichage des actions -->
								<template v-slot:[`item.actions`]="{ item }">
									<v-row class="d-flex justify-end mr-2">
										<!-- Partie édition du compte -->
										<DialogEditRank v-bind:item="item" />

										<!-- Partie suppression du compte -->
										<DialogDeleteRank v-bind:item="item" />
									</v-row>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DialogCreateRank from './DialogCreateRank';
import DialogEditRank from './DialogEditRank';
import DialogDeleteRank from './DialogDeleteRank';

export default {
	name: 'PublicServiceTabItem',

	components: {
		DialogCreateRank,
		DialogEditRank,
		DialogDeleteRank,
	},

	data() {
		return {
		}
	},

	computed: {
		...mapGetters({
			isRanksRetrieving: 'publicService/isRanksRetrieving', // On récupère l'état de récupération de la liste des grades
			ranks: 'publicService/getRanks', // On récupère les grades
		}),

		/**
		 * Les en-têtes du tableau des opérations
		 */
		ranksHeaders() {
			return [
				{ text: 'Niveau', align: 'start', value: 'level' },
				{ text: 'Nom', value: 'labelLong' },
				{ text: 'Nom abrégé', sortable: false, value: 'labelShort' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
		},
	},

	methods: {
		...mapActions({
			retrieveRanksInStore: 'publicService/retrieveRanks', // Récupère l'ensemble des grades.
		}),
	},

	mounted() {
		this.retrieveRanksInStore();
	}
};
</script>
