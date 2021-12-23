<template>
	<form @click="showSnackbar({ name: 'alertUnavailable' })">
		<label :data-state="state">
			<input type="text" placeholder="Search" @click="state = 'open'" @blur="state = 'close'" />
			<v-icon :color="config.color.light.iconColor" size="28">mdi-magnify</v-icon>
		</label>
	</form>
</template>

<script>
import { mapActions } from 'vuex';
import config from '../../config/index';

export default {
	name: 'Search',

	data: () => ({
		config,
		state: 'close',
	}),

	methods: {
		...mapActions({
			showSnackbar: 'snackbar/showSnackbar', // Affiche le snackbar
		}),
	},
};
</script>

<style src="./Search.scss" lang="scss" />
