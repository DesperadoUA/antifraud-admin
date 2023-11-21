<template>
	<div>
		<v-app-bar app dark>
			<v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-sm-and-down">
				<v-btn text exact class="font-podkova-bold nav-link" v-for="link in links" :key="link.title" :to="link.url">
					{{ link.title }}
				</v-btn>
				<v-btn text exact class="font-podkova-bold nav-link" @click="logout" no-prefetch>
					LOGOUT
				</v-btn>
			</v-toolbar-items>
		</v-app-bar>
		<v-navigation-drawer app temporary v-model="drawer" class="grey darken-4" color="deep-orange darken-2">
			<v-container>
				<v-layout class="mt-5 mb-5" wrap>
					<v-btn
						class="deep-orange darken-2 justify-start display_block mb-5 font-podkova-bold"
						dark
						exact
						no-prefetch
						to="/admin"
					>
						<v-icon left color="white">mdi-bank</v-icon>
						Main
					</v-btn>
					<v-btn
						class="deep-orange darken-2 justify-start display_block mb-5 font-podkova-bold"
						dark
						no-prefetch
						to="/admin/join-tables"
					>
						<v-icon left color="white">mdi-message-draw</v-icon>
						Join Tables
					</v-btn>
				</v-layout>
				<v-layout class="justify-space-around mt-3 align-center">
					<v-btn
						class="deep-orange darken-2 display_block justify-start"
						color="deep-orange darken-2 font-podkova-bold"
						@click="logout"
					>
						<v-icon left color="white">mdi-logout</v-icon>
						Logout
					</v-btn>
				</v-layout>
			</v-container>
		</v-navigation-drawer>
	</div>
</template>

<script>
export default {
	name: 'AdminMenu',
	data() {
		return {
			drawer: false,
			links: [
				{ title: 'MAIN', url: '/admin', icon: 'mdi-bank' },
				{ title: 'JOIN TABLES', url: '/admin/join-tables', icon: 'mdi-message-draw' }
			]
		}
	},
	methods: {
		async logout() {
			const user = this.$store.getters['user/getUser']
			const data = {
				session: user.session,
				id: user.id
			}
			await this.$store.dispatch('user/logout', data)
			const currentUser = this.$store.getters['user/getUser']
			if (!currentUser.login) this.$router.push('/')
		}
	}
}
</script>

<style scoped>
.border {
	border: 1px solid red;
}
.display_block {
	width: 100%;
}
.nav-link {
	font-size: 12px;
}
</style>
