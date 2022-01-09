class PublicServiceSalaryService {
	/**
	 * Valeur du point d'indice.
	 */
	__INDEX_POINT() {
		return 4.68602;
	}

	/**
	 * Calcule une simulation salariale en fonction de la date du jour.
	 * le salaire est égale à la différence entre
	 *      - somme des revenus (traitement indiciaire, indemnité de résidence, IFSE, compsensatrice CSG)
	 *      - somme des retenues (retenue PC, CSG non déductible, CSG déductible, crds, transfert prime/point, cotisation SalRAFP).
	 *
	 * Récupère également, quand c'est possible, le précédent et le prochain échelons.
	 *
	 * S'il y a un changement de grade, cela ne retournera que le salaire de l'échelon du nouveau grade.
	 */
	simulateSalary(formSalary, indexGrid) {
		if (formSalary.changeRank) {
			// S'il y a un changement de grade
			return this.simulateSalaryWithChangeRank(formSalary, indexGrid); // On retourne la simulation avec le changement de grade.
		} else {
			// S'il n'y a pas de changement de grade.
			return this.simulateSalaryWithoutChangeRank(formSalary, indexGrid); // On retourne la simulation sans le changement de grade.
		}
	}

	/**
	 * Calcule la simulation salariale sans changement de grade.
	 *
	 * @param {Object} formSalary Objet représentant le formulaire
	 * @param {Array} indexGrid Grille indiciaire
	 */
	simulateSalaryWithoutChangeRank(formSalary, indexGrid) {
		const indexGridRank = this.getIndexGridByRank(formSalary.rank, indexGrid); // On récupère la grille indiciaire du grade
		const ech = this.calculateEchelon(formSalary.startDate, formSalary.endDate, indexGridRank); // On récupère l'échelon.
		const previousEch = { echelon: ech.echelon - 1, monthsOld: ech.monthsOld };
		const nextEch = { echelon: ech.echelon + 1, monthsOld: ech.monthsOld };

		const salaries = [];

		const currentEchelon = this.calculateSalaryByEchelon(ech, indexGridRank, formSalary); // On récupère l'objet complet du salaire pour l'échelon actuel

		if (ech.echelon > 1) {
			// Si on est à pas au premier échelon de la grille
			const previousEchelon = this.calculateSalaryByEchelon(previousEch, indexGridRank, formSalary); // On récupère l'objet complet du salaire pour l'échelon précédent
			salaries.push(previousEchelon); // On l'ajoute dans le tableau des salaires
		}

		salaries.push(currentEchelon); // On ajoute l'échelon actuel dans le tableau des salaires

		if (ech.echelon < indexGridRank.length) {
			// Si on est pas au dernier échelon
			const nextEchelon = this.calculateSalaryByEchelon(nextEch, indexGridRank, formSalary); // On récupère l'objet complet du salaire pour l'échelon d'après
			salaries.push(nextEchelon); // On l'ajoute dans le tableau des salaires
		}

		return salaries;
	}

	/**
	 * Calcule la simulation salariale avec changement de grade.
	 *
	 * @param {Object} formSalary Objet représentant le formulaire
	 * @param {Array} indexGrid Grille indiciaire
	 */
	simulateSalaryWithChangeRank(formSalary, indexGrid) {
		const indexGridRank = this.getIndexGridByRank(formSalary.rank, indexGrid); // On récupère la grille indiciaire du grade avant le changement de grade
		const ech = this.calculateEchelon(formSalary.startDate, formSalary.changeRankDate, indexGridRank); // On récupère l'échelon au moment du changement de grade.

		const indexGridNewRank = this.getIndexGridByRank(formSalary.rankChangeRank, indexGrid); // On récupère la grille indiciaire du nouveau grade.

		const newEch = this.calculateEchelonNewRank(formSalary, ech, indexGridNewRank); // On calcule l'échelon dans le nouveau grade.

		const salaries = [];

		const currentEchelon = this.calculateSalaryByEchelon(newEch, indexGridNewRank, formSalary); // On récupère l'objet complet du salaire pour l'échelon actuel
		salaries.push(currentEchelon); // On ajoute l'échelon actuel dans le tableau des salaires

		return salaries;
	}

	/**
	 * Retourne un objet contenant toutes les informations de calcul d'un salaire par rapport à l'échelon donné.
	 *
	 * @param {integer} ech Echelon à calculer
	 * @param {Array} indexGridRank Grille indiciaire du grade
	 * @param {Object} formSalary Objet provenant de la vue
	 */
	calculateSalaryByEchelon(ech, indexGridRank, formSalary) {
        console.log(ech);
		const increaseIndex = indexGridRank.find(({ echelon }) => echelon === ech.echelon).increaseIndex; // On récupère l'indice majoré
        console.log(increaseIndex);
		const indexSalary = this.calculateIndexSalary(increaseIndex); // On calcule le traitement indiciaire
		const whereIndemnity = this.calculateWhereIndemnity(indexSalary, formSalary.percentWhere); // On calcule l'indemnité de résidence
		const ifse = formSalary.ifse / 12;

		const transport = formSalary.transport ? 34.46 : 0; // Remboursement Navigo annuel

		const incomeSum = indexSalary + whereIndemnity + ifse + formSalary.compensCSG + transport; // Somme des revenus

		const assietteTraitementCSGCRDS = indexSalary + whereIndemnity + ifse; // Traitement brut (utile pour le calcul de la CSG et de la CRDS)
		const assietteRAFP = whereIndemnity + ifse;
		const retenuePC = indexSalary * 0.111; // Calcul de la retenue pour pension civile
		const csgNonDeductible = assietteTraitementCSGCRDS * 0.9825 * 0.024; // 98.25% du traitement brut. la CSG total est de 9.2%
		const csgDeductible = assietteTraitementCSGCRDS * 0.9825 * 0.068; // 98.25% du traitement brut. La CSG total est de 9.2%
		const crds = assietteTraitementCSGCRDS * 0.9825 * 0.005; // 98.25% du traitement brut. la CRDS est de 0.5%
		const cotisationSalRAFP = assietteRAFP > indexSalary * 0.2 ? indexSalary * 0.2 * 0.05 : assietteRAFP * 0.05; // max 20% du traitement indiciaire puis 5% dessus.

		const outcomeSum = retenuePC + csgNonDeductible + csgDeductible + crds + formSalary.primePoint + cotisationSalRAFP;

		const netSalary = incomeSum - outcomeSum;

		const salary = {
			echelon: ech.echelon,
			increaseIndex: increaseIndex,
			indexSalary: indexSalary,
			whereIndemnity: whereIndemnity,
			transport: transport,
			ifse: ifse,
			retenuePC: retenuePC,
			csgNonDeductible: csgNonDeductible,
			csgDeductible: csgDeductible,
			crds: crds,
			cotisationSalRAFP: cotisationSalRAFP,
			primePoint: formSalary.primePoint,
			salary: netSalary,
		};

		return salary;
	}

	getIndexGridByRank(rankId, indexGrid) {
		return indexGrid.filter(({ rank }) => rank === '/api/ref_ranks/' + rankId); // On récupère la grille indiciaire du grade
	}

	/**
	 * Retourne l'échelon par rapport à une grille indiciaire et une date de début.
	 *
	 * @param {Date} startDate Date de début du grade de fonctionnaire
	 * @param {string} endDate Date de fin
	 * @param {Array} indexGrid La grille indiciaire
	 * @param {Object} echelonNewRank L'échelon lors du passage du nouveau grade
	 */
	calculateEchelon(startDate, endDate, indexGridRank, echelonNewRank) {
		const months = this.calculateNumberOfMonths(new Date(startDate), new Date(endDate)); // On récupère le nombre de mois

		let monthsSinceBegining = 0; // Compteur de mois pour compter les mois au fur et à mesure des échelons
		let indexInIndexGrid = 1; // Par défaut on commencera à lire la grille indiciaire au premier échelon

		if (echelonNewRank) {
			indexInIndexGrid = echelonNewRank.echelon;
		}

		// On boucle sur les différents échelons de la grille indiciaire
		for (let index = indexInIndexGrid; index <= indexGridRank.length; index++) {
			const elementIndexGrid = indexGridRank.find(({ echelon }) => echelon === index); // On récupère la ligne de l'échelon

			// S'il y a eu un changement degrade et qu'on est au 1er échelon du changement de grade en enlève l'ancienneté acquise
			if (echelonNewRank && echelonNewRank.echelon == index) {
				// On ajoute la durée de l'échelon (diminué de l'ancienneté acquise avec le changement de grade) au compteur de mois.
				monthsSinceBegining += elementIndexGrid.monthDuration - echelonNewRank.monthsOld;
			} else {
				// Dans tous les autres cas, on ne diminue pas de l'ancienneté acquise
				monthsSinceBegining += elementIndexGrid.monthDuration; // On ajoute la durée de l'échelon au compteur de mois.
			}

			// Si le nombre de mois entre les deux dates est inférieur au compteur de mois, on est dans le bon échelon
			if (months < monthsSinceBegining) {
				const ech = { echelon: elementIndexGrid.echelon, monthsOld: months - (monthsSinceBegining - elementIndexGrid.monthDuration) };
				return ech; // On retourne l'échelon.
			}
		}

		return { echelon: 1, monthsOld: 0 }; // Normalement, on ne devrait jamais atteindre ce return. Si c'était tout de même le cas, on retourne le premier échelon.
	}

	/**
	 * Retourne l'échelon par rapport à la grille indiciaire du nouveau grade et la date du nouveau grade
	 * Se base sur le décrêt 89-750 du 18 octobre 1989 portant statut particulier du corps des ICD
	 *
	 * @param {Object} formSalary Objet représentant le formulaire de la simulation
	 * @param {Object} ech Objet représentant l'échelon (.echelon) et la durée en mois dans l'échelon
	 * @param {Array} indexGridRank Grille indiciaire du nouveau grade.
	 */
	calculateEchelonNewRank(formSalary, ech, indexGridRank) {
		let echelon = {};
		// Situation dans le grade d'ingénieur : échelon 4
		if (ech.echelon == 4) {
			echelon = { echelon: 1, monthsOld: 0 }; // = échelon 1 sans ancienneté
		}

		// Situation dans le grade d'ingénieur : échelon 5
		else if (ech.echelon == 5) {
			echelon = { echelon: 1, monthsOld: Math.round((2 / 3) * ech.monthsOld) }; // = échelon 1 avec 2/3 de l'ancienneté
		}

		// Situation dans le grade d'ingénieur : échelon 6
		else if (ech.echelon == 6) {
			echelon = { echelon: 2, monthsOld: Math.round((5 / 6) * ech.monthsOld) }; // = échelon 2 avec 5/6 de l'ancienneté
		}

		// Situation dans le grade d'ingénieur : échelon 7
		else if (ech.echelon == 7) {
			if (ech.monthsOld < 36) {
				// Avant 3 ans
				echelon = { echelon: 3, monthsOld: ech.monthsOld }; // = échelon 3 avec ancienneté acquise
			} else {
				// A partir de 3 ans
				echelon = { echelon: 4, monthsOld: ech.monthsOld - 36 }; // = échelon 4 avec ancienneté acquise après 3 ans
			}
		}

		// Situation dans le grade d'ingénieur : échelon 8
		else if (ech.echelon == 8) {
			if (ech.monthsOld < 24) {
				// Avant 2 ans
				echelon = { echelon: 4, monthsOld: ech.monthsOld + 12 }; // = échelon 4 avec ancienneté acquise + 1 an
			} else {
				// A partir de 2 ans
				echelon = { echelon: 5, monthsOld: 0 }; // = échelon 5 sans ancienneté
			}
		}

		// Situation dans le grade d'ingénieur : échelon 9
		else if (ech.echelon == 9) {
			echelon = { echelon: 5, monthsOld: Math.round((1 / 2) * ech.monthsOld) }; // = échelon 5 avec 1/2 de l'ancienneté
		}

		// Situation dans le grade d'ingénieur : échelon 10
		else if (ech.echelon == 10) {
			echelon = { echelon: 5, monthsOld: ech.monthsOld + 24 > 35 ? 35 : ech.monthsOld + 24 }; // = échelon 1 avec ancienneté acquise + 2 ans dans la limite de la durée de l'échelon
		}

		const newEchelon = this.calculateEchelon(formSalary.changeRankDate, formSalary.endDate, indexGridRank, echelon);

		return newEchelon;
	}

	/**
	 * Retourne le traitement indiciaire en fonction de l'indice majoré.
	 *
	 * @param {integer} increaseIndex L'indice majoré
	 * @returns le traitement indiciaire
	 */
	calculateIndexSalary(increaseIndex) {
		return increaseIndex * this.__INDEX_POINT();
	}

	/**
	 * Retourne l'indemnité de résidence. Est égale à un pourcentage (0%, 1% ou 3%) du traitement indiciaire.
	 *
	 * @param {Number} indexSalary Traitement indiciaire
	 * @param {integer} percentWhere Pourcentage pour l'indemnité de résidence
	 * @returns indemnité de résidence
	 */
	calculateWhereIndemnity(indexSalary, percentWhere) {
		if (percentWhere) {
			// Si le pourcentage est définit
			const percent = parseInt(percentWhere); // On parse le string en integer

			if (percent == 0) return 0;
			// Cas 0%
			else return (percent / 100) * indexSalary; // Cas 1% ou 3%
		} else {
			// Sinon, on retourne 0 en prenant le cas par défaut : 0%
			return 0;
		}
	}

	/**
	 * Calcule le nombre de mois entre les deux dates
	 *
	 * @param {Date} startDate La date de départ dans le grade
	 * @param {Date} endDate La date de fin dans le grade
	 * @returns le nombre de mois entre les deux dates.
	 */
	calculateNumberOfMonths(startDate, endDate) {
		const endYear = endDate.getFullYear();
		const endMonth = endDate.getMonth();
		const startYear = startDate.getFullYear();
		const startMonth = startDate.getMonth();

		return (endYear - startYear) * 12 + (endMonth - startMonth);
	}
}

export default new PublicServiceSalaryService();
