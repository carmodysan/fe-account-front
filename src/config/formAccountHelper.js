export default {
    // Parties règles de validation des formulaires des comptes
    formRules: {
        accountName: [(v) => !!v || `Le nom du compte est obligatoire`],
        category: [(v) => !!v || `La catégorie du compte est obligatoire`],
        establishment: [(v) => !!v || `L'établissement' est obligatoire`],
        year: [(v) => !!v || `L'année' est obligatoire`],
    },

    // Partie liste des items des v-select dans les formulaires
    formSelect: {
        // Liste des catégories des comptes possibles
        categories: [
			{ text: 'Compte courant', value: 'Current' },
			// { text: 'Compte dépargne', value: 'Savings' },
		],
        // Liste des établissement existants
        establishments: [
            { text: 'Boursorama', value: 'Boursorama'},
            { text: 'Degiro', value: 'Degiro'},
            { text: 'Fortuneo', value: 'Fortuneo'},
            { text: 'La Banque Postale', value: 'La Banque Postale'},
            { text: 'Société Générale', value: 'Société Générale'},
        ]
    }
}