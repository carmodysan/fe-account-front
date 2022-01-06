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
	alertMACreatingError: {
		text: `Une erreur est survenue durant la création des comptes mensuels.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertMACreated: {
		text: `Les comptes mensuels ont bien été créés.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	alertMARetrievingError: {
		text: `Une erreur est survenue durant la récupération des comptes mensuels.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertMACurrent: {
		text: `Ce compte mensuel est maintenant le compte mensuel en cours.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	// Opérations
	// Création
	alertOperationCreatingError: {
		text: `Une erreur est survenue durant la création de l'opération.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertOperationCreated: {
		text: `L'opération a bien été créée.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	// Récupération
	alertOperationRetrievingError: {
		text: `Une erreur est survenue durant la récupération des opérations.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	// Modification
	alertOperationUpdatingError: {
		text: `Une erreur est survenue durant la modification de l'opération.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertOperationUpdated: {
		text: `L'opération est bien modifiée.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-pencil`,
	},
	// Suppression
	alertOperationDeletingError: {
		text: `Une erreur est survenue durant la suppression de l'opération.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertOperationDeleted: {
		text: `L'opération est bien supprimée.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-delete`,
	},
	// Opérations périodiques
	// Création
	alertPeriodicOperationCreatingError: {
		text: `Une erreur est survenue durant la création de l'opération périodique.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertPeriodicOperationCreated: {
		text: `L'opération périodique a bien été créée.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	// Récupération
	alertPeriodicOperationRetrievingError: {
		text: `Une erreur est survenue durant la récupération des opérations périodiques.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	// Modification
	alertPeriodicOperationUpdatingError: {
		text: `Une erreur est survenue durant la modification de l'opération périodique.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertPeriodicOperationUpdated: {
		text: `L'opération périodique est bien modifiée.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-pencil`,
	},
	// Suppression
	alertPeriodicOperationDeletingError: {
		text: `Une erreur est survenue durant la suppression de l'opération périodique.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertPeriodicOperationDeleted: {
		text: `L'opération périodique est bien supprimée.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-delete`,
	},
	
	// Grades
	// Création
	alertRankCreatingError: {
		text: `Une erreur est survenue durant la création du grade.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertRankCreated: {
		text: `Le grade a bien été créé.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-checkbox-marked-circle-outline`,
	},
	// Récupération
	alertRankRetrievingError: {
		text: `Une erreur est survenue durant la récupération des grades.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	// Modification
	alertRankUpdatingError: {
		text: `Une erreur est survenue durant la modification du grade.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertRankUpdated: {
		text: `Le grade est bien modifié.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-pencil`,
	},
	// Suppression
	alertRankDeletingError: {
		text: `Une erreur est survenue durant la suppression du grade.`,
		color: `error`,
		colorBtnClose: `red darken-4`,
		icon: `mdi-alert-octagram`,
	},
	alertRankDeleted: {
		text: `Le grade est bien supprimé.`,
		color: `success`,
		colorBtnClose: `green darken-4`,
		icon: `mdi-delete`,
	},
};
