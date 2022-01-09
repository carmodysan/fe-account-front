<template>
	<v-row>
		<!-- Partie grille indiciaire -->
		<v-col cols="12">
			<v-card flat>
				<v-card-title class="pa-6 pb-6 d-flex justify-space-between">
					<p>Grille indiciaire des Ingénieurs Civils de la Défense</p>
					<DialogCreateEchelon />
				</v-card-title>
				<v-card-text class="pa-6 pt-0">
					<v-row no-gutters class="pb-5" align="center">
						<v-col cols="12">
							<div v-if="isRanksRetrieving">Grilles en cours de récupération</div>
							<v-data-table v-else disable-pagination hide-default-footer :headers="indexGridHeaders" :items="indexGrid" item-key="id">
								<!-- Affichage du grade -->
								<template v-slot:[`item.rank`]="{ item }">
									{{ getLabelLongbyRankId(item.rank) }}
								</template>

								<!-- Affichage des actions -->
								<template v-slot:[`item.actions`]="{ item }">
									<v-row class="d-flex justify-end mr-2">
										<!-- Partie édition du compte -->
										<DialogEditEchelon v-bind:item="item" />

										<!-- Partie suppression du compte -->
										<DialogDeleteEchelon v-bind:item="item" />
									</v-row>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>

		<!-- Partie Grade -->
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

import DialogCreateRank from './rank/DialogCreateRank';
import DialogEditRank from './rank/DialogEditRank';
import DialogDeleteRank from './rank/DialogDeleteRank';

import DialogCreateEchelon from './indexGrid/DialogCreateEchelon';
import DialogEditEchelon from './indexGrid/DialogEditEchelon';
import DialogDeleteEchelon from './indexGrid/DialogDeleteEchelon';

export default {
	name: 'PublicServiceTabItem',

	components: {
		DialogCreateRank,
		DialogEditRank,
		DialogDeleteRank,
		DialogCreateEchelon,
		DialogEditEchelon,
		DialogDeleteEchelon,
	},

	data() {
		return {};
	},

	computed: {
		...mapGetters({
			isRanksRetrieving: 'publicService/isRanksRetrieving', // On récupère l'état de récupération de la liste des grades
			ranks: 'publicService/getRanks', // On récupère les grades
			isIndexGridRetrieving: 'publicService/isIndexGridRetrieving', // On récupére l'état de récupération de la grille indiciaire
			indexGrid: 'publicService/getIndexGrid', // On récupère la grille indiciaire
		}),

		/**
		 * Les en-têtes du tableau des grades
		 */
		ranksHeaders() {
			return [
				{ text: 'Niveau', align: 'start', value: 'level' },
				{ text: 'Nom', value: 'labelLong' },
				{ text: 'Nom abrégé', sortable: false, value: 'labelShort' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
		},

		/**
		 * Les en-têtes du tableau des grilles indiciaires
		 */
		indexGridHeaders() {
			return [
				{ text: 'Grade', sortable: false, value: 'rank' },
				{ text: 'Echelon', sortable: false, value: 'echelon' },
				{ text: 'Durée', sortable: false, value: 'monthDuration' },
				{ text: 'Indice brut', sortable: false, value: 'grossIndex' },
				{ text: 'Indice majoré', sortable: false, value: 'increaseIndex' },
				{ text: '', sortable: false, align: 'end', value: 'actions' },
			];
		},
	},

	methods: {
		...mapActions({
			retrieveRanksInStore: 'publicService/retrieveRanks', // Récupère l'ensemble des grades.
			retrieveIndexGridInStore: 'publicService/retrieveIndexGrid', // Récupère la grille indiciaire
		}),

		/**
		 * Récupère le nom du grade.
		 */
		getLabelLongbyRankId(rankIdAPI) {
			if (rankIdAPI) {
				const rankId = rankIdAPI.split('/')[3];
				const rank = this.ranks.find(({ id }) => id === rankId);
				console.log(this.ranks);
				if (rank && rank.labelLong) return rank.labelLong;
				else return rankIdAPI;
			} else return rankIdAPI;
		},
	},

	mounted() {
		this.retrieveRanksInStore();
		this.retrieveIndexGridInStore();
	},
};
</script>
