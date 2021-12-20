import axios from './FEApiService';

class AccountsDataService {
    /**
     * Récupère toutes les comptes.
     * 
     * @param String authorId Identifiant de l'utilisateur
     * @returns la liste des comptes.
     */
	getAll(authorId) {
		return axios.get(`/accounts?authorId=${authorId}&order[bank]`);
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
     * Récupère un compte particulier par le slug
     * 
     * @param String slug Le slug du compte à récupérer
     * @returns un compte
     */
    getBySlug(slug) {
        return axios.get(`/accounts?slug=${slug}`);
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
