export default {
	// Parties règles de validation des formulaires des comptes et opérations
	formRules: {
		accountName: [(v) => !!v || `Le nom du compte est obligatoire`],
		category: [(v) => !!v || `La catégorie du compte est obligatoire`],
		establishment: [(v) => !!v || `L'établissement' est obligatoire`],
		year: [(v) => !!v || `L'année' est obligatoire`],
		number: [(v) => !!v || 'Un montant est obligatoire'],
		description: [(v) => !!v || 'Une description est obligatoire'],
		dayOfMonth: [(v) => !!v || 'Un jour est obligatoire'],
	},

	// Partie liste des items des v-select dans les formulaires pour les comptes
	formAccountSelect: {
		// Liste des catégories des comptes possibles
		categories: [
			{ text: 'Compte courant', value: 'Current' },
			// { text: 'Compte dépargne', value: 'Savings' },
		],
		// Liste des établissement existants
		establishments: [
			{ text: 'Boursorama', value: 'Boursorama' },
			{ text: 'Degiro', value: 'Degiro' },
			{ text: 'Fortuneo', value: 'Fortuneo' },
			{ text: 'La Banque Postale', value: 'La Banque Postale' },
			{ text: 'Société Générale', value: 'Société Générale' },
		],
	},

	// Partie liste des items des v-select dans les formulaires pour les opérations
	formOperationSelect: {
		// Liste des catégories des opérations possibles
		categories: [
			{ text: 'Alimentation', value: 'Alimentation' },
			{ text: 'Assurance', value: 'Insurance' },
			{ text: 'Beauté', value: 'Beauty' },
			{ text: 'Energie', value: 'Energy' },
			{ text: 'Impôt', value: 'Taxes' },
			{ text: 'Logement', value: 'Habitat' },
			{ text: 'Loisir', value: 'Fun' },
			{ text: 'Santé', value: 'Health' },
			{ text: 'Télécommunication', value: 'Telecom' },
			{ text: 'Transport', value: 'Transport' },
			{ text: 'Travail', value: 'Job' },
		],

		// Liste des jours du mois - Il y a sûrement une manière plus élégente de faire cette liste avec un v-select...
		dayOfMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
	},
};
