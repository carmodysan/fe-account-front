<template>
    <v-container fluid>
        Dashboard {{ user.email }}
        <v-btn :to="{ name: 'Home' }">Home</v-btn>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Home',

    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        })
    }
}
</script>