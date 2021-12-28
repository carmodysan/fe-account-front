import axios from './FEApiService';

class AccountsDataService {
    /**
     * Récupère toutes les comptes.
     * 
     * @param String authorId Identifiant de l'utilisateur
     * @returns la liste des comptes.
     */
	getAll(authorId) {
		// return axios.get(`/accounts?authorId=${authorId}&order[bank]`);
        console.log(authorId);
        return axios.get(`/current_accounts?authorId=${authorId}`);
	}

    /**
     * Récupère un compte particulier.
     * 
     * @param String id Identifiant du compte
     * @returns un compte.
     */
	get(id) {
		return axios.get(`/accounts/${id}`);
	}

    /**
     * Créé un compte
     * 
     * @param Account data 
     * @returns Response
     */
	create(data) {
		return axios.post('/accounts', data);
	}

    /**
     * Met à jour un compte.
     * 
     * @param String id Identifiant du compte
     * @param Account data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/accounts/${id}`, data);
	}

    /**
     * Supprime un compte.
     * 
     * @param String id Identifiant du compte
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/accounts/${id}`);
	}
}

export default new AccountsDataService();
