<template>
	<v-app class="pa-6">
		<Header />
		<p>My super sidebar</p>
		<v-main class="content">
			<router-view />
			<p>My super Footer</p>
		</v-main>
	</v-app>
</template>

<script>
import Header from "../header/Header";

export default {
    name: "Layout",
    components: { Header },
}
</script>

<style src="./Layout.scss" lang="scss" />