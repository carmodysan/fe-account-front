import axios from './FEApiService';

class InterestRateDataService {
    /**
     * Récupère tous les taux d'intérêts d'un compte d'épargne.
     * 
     * @param String id Identifiant du compte d'épargne
     * @returns la liste des taux d'intérêts d'un compte d'épargne.
     */
	getAll(id) {
		return axios.get(`/savings_accounts/${id}/interest_rates?order[startDate]`);
	}

    /**
     * Récupère un taux d'intérêts particulier.
     * 
     * @param String id Identifiant du taux d'intérêts
     * @returns une taux d'intérêts.
     */
	get(id) {
		return axios.get(`/interest_rates/${id}`);
	}

    /**
     * Créé une taux d'intérêts
     * 
     * @param Operation data 
     * @returns Response
     */
	create(data) {
		return axios.post('/interest_rates', data);
	}

    /**
     * Met à jour un taux d'intérêts.
     * 
     * @param String id Identifiant du taux d'intérêts
     * @param Operation data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/interest_rates/${id}`, data);
	}

    /**
     * Supprime un taux d'intérêts.
     * 
     * @param String id Identifiant du taux d'intérêts
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/interest_rates/${id}`);
	}
}

export default new InterestRateDataService();
