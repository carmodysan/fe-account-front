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
	}

};
