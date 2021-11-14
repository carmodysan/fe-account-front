<template>
	<div class="about">
		<h1>This is an about page with a good backend api</h1>
    <h3>{{ test }}</h3>
	</div>
</template>

<script>
import axios from "axios";

export default {
	data: () => ({
		test: null,
	}),

	methods: {
		async init() {
			await axios
				.get("/operations")
				.then((response) => {
					this.test = response.data["hydra:member"];
				})
				.finally(() => {});
		},
	},

	created() {
		this.init();
	},
};
</script>
