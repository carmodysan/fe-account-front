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
						<v-card-title class="pa-6 pb-6"><p>Simulation du salaire</p></v-card-title>
						<v-card-text class="pa-6 pt-0">
							<v-row>
								<v-col cols="3">
									<v-menu ref="menuCreate" v-model="dialogStartDate" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												v-model="formSalary.startDate"
												label="Choisissez une date de début de grade"
												prepend-icon="mdi-calendar"
												readonly
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker v-model="formSalary.startDate" no-title scrollable @input="dialogStartDate = false"> </v-date-picker>
									</v-menu>
								</v-col>
								<v-col cols="3">
									<v-menu ref="menuCreate" v-model="dialogEndDate" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												v-model="formSalary.endDate"
												label="Choisissez une date dans le futur"
												prepend-icon="mdi-calendar"
												readonly
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker v-model="formSalary.endDate" no-title scrollable @input="dialogEndtDate = false"> </v-date-picker>
									</v-menu>
								</v-col>
								<v-col cols="3">
									<v-select v-model="rank" :items="ranks" item-text="labelLong" item-value="id" label="Grade" return-object></v-select>
								</v-col>
								<v-col cols="3">
									<v-text-field v-model="formSalary.primePoint" label="Transfert prime/point"></v-text-field>
								</v-col>
								<v-col cols="3">
									<v-text-field v-model="formSalary.compensCSG" label="Compensatrice CSG"></v-text-field>
								</v-col>
								<v-col cols="3">
									<v-text-field v-model="formSalary.ifse" label="IFSE" type="number" min="1" max="100000"></v-text-field>
								</v-col>
								<v-col cols="3">
									Indemnité de résidence
									<v-radio-group v-model="formSalary.percentWhere" row>
										<v-radio label="0%" value="0"></v-radio>
										<v-radio label="1%" value="1"></v-radio>
										<v-radio label="3%" value="3"></v-radio>
									</v-radio-group>
								</v-col>
								<v-col cols="3">
									<v-checkbox v-model="formSalary.transport" label="Remboursement domicile-travail"></v-checkbox>
								</v-col>
								<v-col cols="3">
									<v-checkbox v-model="formSalary.changeRank" label="Passage de grade"></v-checkbox>
								</v-col>
								<v-col cols="3">
									<v-menu ref="menuCreate" v-model="dialogChangeRank" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												v-model="formSalary.changeRankDate"
												label="Choisissez une date de changement de grade"
												prepend-icon="mdi-calendar"
												readonly
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker v-model="formSalary.changeRankDate" no-title scrollable @input="dialogChangeRank = false"> </v-date-picker>
									</v-menu>
								</v-col>
								<v-col cols="3">
									<v-select v-model="rankChangeRank" :items="ranks" item-text="labelLong" item-value="id" label="Nouveau grade" return-object></v-select>
								</v-col>
							</v-row>
						</v-card-text>
						<v-card-actions>
							<v-btn @click="calculateSalary()">Calculer salaire</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-data-table disable-pagination hide-default-footer :headers="salariesHeaders" :items="salaries" item-key="echelon">
						<!-- Affichage Traitement indiciaire -->
						<template v-slot:[`item.indexSalary`]="{ item }">
							{{ item.indexSalary.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage Indemnité de résidence -->
						<template v-slot:[`item.whereIndemnity`]="{ item }">
							{{ item.whereIndemnity.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage IFSE -->
						<template v-slot:[`item.ifse`]="{ item }">
							{{ item.ifse.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage Retenue PC -->
						<template v-slot:[`item.retenuePC`]="{ item }">
							{{ item.retenuePC.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage CSG non déductible -->
						<template v-slot:[`item.csgNonDeductible`]="{ item }">
							{{ item.csgNonDeductible.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage CSG déductible -->
						<template v-slot:[`item.csgDeductible`]="{ item }">
							{{ item.csgDeductible.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage CRDS -->
						<template v-slot:[`item.crds`]="{ item }">
							{{ item.crds.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage côtisation salarialle RAFP -->
						<template v-slot:[`item.cotisationSalRAFP`]="{ item }">
							{{ item.cotisationSalRAFP.toFixed(2) | formatCurrencyNumber }}
						</template>
						<!-- Affichage Traitement net -->
						<template v-slot:[`item.salary`]="{ item }">
							<strong>{{ item.salary.toFixed(2) | formatCurrencyNumber }}</strong>
						</template>
					</v-data-table>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PublicServiceDataService from '../../services/PublicServiceSalaryService';

export default {
	name: 'PublicService',

	data() {
		return {
			dialogStartDate: false,
			dialogEndDate: false,
			dialogChangeRank: false,

			rank: {
				labelLong: 'grade',
				id: 'id_grade',
			},

			rankChangeRank: {
				labelLong: 'grade',
				id: 'id_grade',
			},

			formSalary: {
				startDate: '2018-06-01',
				endDate: '2026-06-01',
				// endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
				rank: '',
				transport: true,
				primePoint: 32.42,
				compensCSG: 26.69,
				percentWhere: 0,
				ifse: 10800,
				changeRank: true,
				changeRankDate: '2026-06-01',
				// changeRankDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
				rankChangeRank: '',
			},

			salaries: [],
		};
	},

	methods: {
		...mapActions({
			retrieveRanksInStore: 'publicService/retrieveRanks', // Récupère l'ensemble des grades.
			retrieveIndexGridInStore: 'publicService/retrieveIndexGrid', // Récupère la grille indiciaire
			simulateSalary: 'publicService/simulateSalary', // Calcule le salaire actuel
		}),

		/**
		 * Calcule le salaire actuel et remplie le tableau des salaires avec l'échelon précédent, en cours et prochain.
		 */
		calculateSalary() {
			this.formSalary.rank = this.rank.id;
			this.formSalary.rankChangeRank = this.rankChangeRank.id;
			this.salaries = PublicServiceDataService.simulateSalary(this.formSalary, this.indexGrid);
		},
	},

	computed: {
		...mapGetters({
			ranks: 'publicService/getRanks', // On récupère les grades
			indexGrid: 'publicService/getIndexGrid', // On récupère la grille indiciaire
		}),

		/**
		 * Les en-têtes des salaires
		 */
		salariesHeaders() {
			return [
				{ text: 'Echelon', sortable: false, align: 'center', value: 'echelon' },
				{ text: 'Indice majoré', sortable: false, align: 'center', value: 'increaseIndex' },
				{ text: 'Traitement indiciaire', sortable: false, align: 'center', value: 'indexSalary' },
				{ text: 'Indemnité de résidence', sortable: false, align: 'center', value: 'whereIndemnity' },
				{ text: 'Remboursement domicile-travail', sortable: false, align: 'center', value: 'transport' },
				{ text: 'IFSE', sortable: false, align: 'center', value: 'ifse' },
				{ text: 'Retenue PC', sortable: false, align: 'center', value: 'retenuePC' },
				{ text: 'CSG Non déductible', sortable: false, align: 'center', value: 'csgNonDeductible' },
				{ text: 'CSG déductible', sortable: false, align: 'center', value: 'csgDeductible' },
				{ text: 'CRDS', sortable: false, align: 'center', value: 'crds' },
				{ text: 'Côtisation Salariale RAFP', sortable: false, align: 'center', value: 'cotisationSalRAFP' },
				{ text: 'Transfert primes/points', sortable: false, align: 'center', value: 'primePoint' },
				{ text: 'Traitement net', sortable: false, align: 'center', value: 'salary' },
			];
		},
	},

	mounted() {
		this.retrieveRanksInStore();
		this.retrieveIndexGridInStore();
	},
};
</script>
