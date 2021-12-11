import axios from 'axios';

class MonthlyAccountsDataService {
    /**
     * Récupère toutes les comptes mensuels.
     * 
     * @param String accountId Le compte bancaire contenant les différents comptes mensuels
     * @returns la liste des comptes mensuels.
     */
	getAll(accountId) {
		return axios.get(`/accounts/${accountId}/monthly_accounts`);
	}

    /**
     * Récupère un compte mensuel particulier.
     * 
     * @param String id Identifiant du compte mensuel
     * @returns un compte mensuel.
     */
	get(id) {
		return axios.get(`/monthly_accounts/${id}`);
	}

    /**
     * Créé un compte mensuel
     * 
     * @param MonthlyAccounts data 
     * @returns Response
     */
	create(data) {
		return axios.post('/monthly_accounts', data);
	}

    /**
     * Met à jour un compte mensuel.
     * 
     * @param String id Identifiant du compte mensuel
     * @param MonthlyAccounts data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/monthly_accounts/${id}`, data);
	}

    /**
     * Supprime un compte mensuel.
     * 
     * @param String id Identifiant du compte mensuel
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/monthly_accounts/${id}`);
	}
}

export default new MonthlyAccountsDataService();
