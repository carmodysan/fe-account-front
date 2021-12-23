<template>
	<v-app class="pa-6">
		<Header />
		<Sidebar />
		<p>My super sidebar</p>
		<v-main class="content">
			<router-view />
			<p>My super Footer</p>
		</v-main>
	</v-app>
</template>

<script>
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

export default {
    name: "Layout",
    components: { Header, Sidebar },
}
</script>

<style src="./Layout.scss" lang="scss" />