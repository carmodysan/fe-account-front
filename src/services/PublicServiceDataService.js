import axios from './FEApiService';

class PublicServiceDataService {
    /**
     * Récupère tous les grades.
     * 
     * @returns la liste des grades.
     */
	getAll() {
		return axios.get(`/ref_ranks`);
	}

    /**
     * Récupère un grade.
     * 
     * @param String id Identifiant du grade
     * @returns un grade.
     */
	get(id) {
		return axios.get(`/ref_ranks/${id}`);
	}

    /**
     * Créé un grade
     * 
     * @param RefRank data 
     * @returns Response
     */
	create(data) {
		return axios.post('/ref_ranks', data);
	}

    /**
     * Met à jour un grade.
     * 
     * @param String id Identifiant du grade
     * @param RefRank data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/ref_ranks/${id}`, data);
	}

    /**
     * Supprime un grade.
     * 
     * @param String id Identifiant du grade
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/ref_ranks/${id}`);
	}
}

export default new PublicServiceDataService();