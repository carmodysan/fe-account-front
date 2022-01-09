import axios from './FEApiService';

class PublicServiceDataService {
    /**
     * ===============>>> Partie Grades <<<===============
     */
    /**
     * Récupère tous les grades.
     * 
     * @returns la liste des grades.
     */
	getAllRanks() {
		return axios.get(`/ref_ranks`);
	}

    /**
     * Récupère un grade.
     * 
     * @param String id Identifiant du grade
     * @returns un grade.
     */
	getRank(id) {
		return axios.get(`/ref_ranks/${id}`);
	}

    /**
     * Créé un grade
     * 
     * @param RefRank data 
     * @returns Response
     */
	createRank(data) {
		return axios.post('/ref_ranks', data);
	}

    /**
     * Met à jour un grade.
     * 
     * @param String id Identifiant du grade
     * @param RefRank data 
     * @returns Response
     */
	updateRank(id, data) {
		return axios.put(`/ref_ranks/${id}`, data);
	}

    /**
     * Supprime un grade.
     * 
     * @param String id Identifiant du grade
     * @returns Response
     */
	deleteRank(id) {
		return axios.delete(`/ref_ranks/${id}`);
	}


    /**
     * ===============>>> Partie Grille indiciaire <<<===============
     */
    /**
     * Récupère la grille indiciaire.
     * 
     * @returns la grille indiciaire.
     */
	getIndexGrid() {
		return axios.get(`/ref_index_grids`);
	}

    /**
     * Récupère un échelon.
     * 
     * @param String id Identifiant de l'échelon
     * @returns un échelon.
     */
	getEchelon(id) {
		return axios.get(`/ref_index_grids/${id}`);
	}

    /**
     * Créé un échelon
     * 
     * @param RefIndexGrid data 
     * @returns Response
     */
	createEchelon(data) {
		return axios.post('/ref_index_grids', data);
	}

    /**
     * Met à jour un échelon.
     * 
     * @param String id Identifiant de l'échelon
     * @param RefIndexGrid data 
     * @returns Response
     */
	updateEchelon(id, data) {
		return axios.put(`/ref_index_grids/${id}`, data);
	}

    /**
     * Supprime un échelon.
     * 
     * @param String id Identifiant de l'échelon
     * @returns Response
     */
	deleteEchelon(id) {
		return axios.delete(`/ref_index_grids/${id}`);
	}
}

export default new PublicServiceDataService();