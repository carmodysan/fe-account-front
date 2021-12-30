export default {
	// Partie commune
	alertUnavailable: {
		text: `Cette fonctionnalité n'est pas encore disponible.`,
		color: `info`,
		colorBtnClose: `blue darken-4`,
		icon: `mdi-alert-circle`,
	},

	// Partie Login
	alertLogin401: {
		text: `Le mot de passe ou l'adresse mail est invalide !`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertLoginError: {
		text: `Une erreur est survenue durant l'authentification, merci de réessayer ultérieurement !`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertWelcomeUser: {
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	
	// Partie Logout
	alertLogoutByUser: {
		text: `Vous vous êtes déconnecté ! Merci et à bientôt.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	alertLogoutSessionTimeout: {
		text: `Votre session a expirée, merci de vous connecter à nouveau.`,
		color: `warning`,
		colorBtnClose: `yellow darken-4`,
		icon: `mdi-alert`,
	},

	// ==========================>>> Partie Comptes <<<==========================
	// Récupération
	alertAccountsRetrievingError: {
		text: `Une erreur est survenue durant la récupération des comptes.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	// Création
	alertAccountCreatingError: {
		text: `Une erreur est survenue durant la création du compte.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertAccountCreated: {
		text: `Le compte a bien été créé.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	// Modification
	alertAccountUpdatingError: {
		text: `Une erreur est survenue durant la modification du compte.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertAccountUpdated: {
		text: `Le compte est bien modifié.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-pencil`,
	},
	// Suppression
	alertAccountDeletingError: {
		text: `Une erreur est survenue durant la suppression du compte.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertAccountDeleted: {
		text: `Le compte est bien supprimé.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-delete`,
	},
	// MonthlyAccount
	alertMACreatingYearError: {
		text: `Vous devez sélectionner une année pour pouvoir ajouter des comptes mensuels.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
};
