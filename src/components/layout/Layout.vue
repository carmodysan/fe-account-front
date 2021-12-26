<template>
	<v-app>
		<Header />
		<Sidebar />
		<v-main class="content">
			<router-view />
			<Footer />
		</v-main>
	</v-app>
</template>

<script>
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import Footer from '../footer/Footer';

export default {
	name: 'Layout',
	components: { Header, Sidebar, Footer },
};
</script>

<style src="./Layout.scss" lang="scss" />
