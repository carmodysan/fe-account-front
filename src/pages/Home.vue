<template>
    <v-container>
        Home {{ user.email }}
        <v-btn :to="{ name: 'Dashboard' }">Dashboard</v-btn>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Home',

    metaInfo: {
		title: 'Accueil',
	},

    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        })
    }
}
</script>