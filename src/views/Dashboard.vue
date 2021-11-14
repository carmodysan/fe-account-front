<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center" class="d-flex flex-column">
			<v-row class="d-flex justify-center">
				<div class="text-h3 mb-6 text-center">{{ user.name }}</div>
			</v-row>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
import { mapGetters } from 'vuex';
export default {
	name: "Dashboard",

    computed: {
        ...mapGetters({
            user: 'auth/getUser'
        })
    }
};
</script>
