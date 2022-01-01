<template>
	<v-dialog v-model="dialog" :key="item.id + 'deleteKey'" persistent max-width="290">
		<template #activator="dialogDeleteActivator">
			<v-tooltip bottom color="error">
				<template #activator="tooltipDeleteActivator">
					<v-btn
						v-on="{ ...dialogDeleteActivator.on, ...tooltipDeleteActivator.on }"
						@click.stop="dialog = true"
						fab
						outlined
						elevation="2"
						small
						class="mx-2"
						color="error"
					>
						<v-icon>mdi-delete</v-icon>
					</v-btn>
				</template>
				<span>Supprimer</span>
			</v-tooltip>
		</template>
		<v-card>
			<v-card-title>Suppression du compte</v-card-title>
			<v-card-text>Attention, êtes vous bien sûr de vouloir supprimer ce compte : {{ item.name }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="dialog = false">Annuler</v-btn>
				<v-btn @click="deleteAccount()">Supprimer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: 'DialogDeleteAccount',

	props: {
		item: Object,
	},

	data() {
		return {
			dialog: false,
		};
	},

	methods: {
		...mapActions({
			deleteAccountInStore: 'accounts/deleteAccount', // Envoie la modification d'un compte dans le store et lance le rafraichissement de la liste des comptes.
		}),

		/**
		 * Modifie le compte
		 */
		deleteAccount() {
			this.dialog = false; // On ferme le dialog
			this.deleteAccountInStore(this.item);
		},
	},
};
</script>
