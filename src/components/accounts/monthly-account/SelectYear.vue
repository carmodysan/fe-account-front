<template>
	<v-select :value="value" @change="select" :items="items" label="Choisissez une année" :rules="helper.formRules.year" required />
</template>

<script>
import formHelper from '../../../config/formAccountHelper';

export default {
	name: 'SelectYear',

	props: {
		value: Number,
	},

	data() {
		return {
			items: [],

			// Helper formulaire (règles, listes...)
			helper: formHelper,
		};
	},

	methods: {
		select(event) {
			this.$emit('input', event);
		},
	},

	/**
	 * A la création du composant, on récupère l'année en cours et les 9 précédentes.
	 * Si nous sommes en décembre, on ajoutera également l'année à venir.
	 */
	created: function () {
		const d = new Date(); // On récupère la date courante
		const year = d.getFullYear(); // On récupère l'année courante
		const month = d.getMonth(); // On récupère le mois courant
		if (month == 11) {
			// Si nous sommes en décembre, alors on proposera l'année à venir en plus.
			this.items.push(year + 1);
		}
		// On parcourt les 9 années précédentes.
		for (let y = year; y > year - 10; y--) {
			this.items.push(y);
		}
		// this.value = year;
	},
};
</script>
