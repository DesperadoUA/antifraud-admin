<template>
	<v-container class="container--fluid pa-0">
		<v-row>
			<v-col class="offset-1 col-10 font-podkova-bold blue-grey darken-4">
				<v-expansion-panels inset>
					<v-expansion-panel>
						<v-expansion-panel-header>{{ title }}</v-expansion-panel-header>
						<v-expansion-panel-content class="pt-4">
							<v-container class="bb_orange" v-for="(item, index) in currenData" :key="index">
								<v-row align="center">
									<v-col class="d-flex" cols="12" sm="12">
										<v-select
											color="deep-orange darken-2"
											:items="Object.keys(schema)"
											v-model="currenData[index].sheet"
											@change="changeMainRelative(index)"
										></v-select>
									</v-col>
									<v-col class="d-flex" cols="12" sm="12" v-if="currenData[index].sheet">
										<v-combobox
											v-model="currenData[index].column"
											:items="schema[currenData[index].sheet]"
											label="Columns"
											multiple
											outlined
											dense
											@change="change"
										></v-combobox>
									</v-col>
									<v-col class="d-flex" cols="12" sm="12" v-if="currenData[index].sheet">
										<v-select
											color="deep-orange darken-2"
											:items="schema[currenData[index].sheet]"
											v-model="currenData[index].uniqueId"
											@change="change"
										></v-select>
									</v-col>
									<v-col class="d-flex" cols="12" sm="12" style="border-bottom:  1px solid white;">
										<v-btn class="deep-orange darken-2 font-podkova-bold" @click="deleteItem(item)">
											<v-icon left>mdi-delete</v-icon>
											Delete
										</v-btn>
									</v-col>
								</v-row>
							</v-container>
							<v-btn class="deep-orange darken-2 font-podkova-bold mt-5" @click="addItem">
								<v-icon left>mdi-playlist-plus</v-icon>
								Add
							</v-btn>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import MM_Options from '~/components/lib/MM_Options'
import MM_Relative_Posts from '~/components/lib/MM_Relative_Posts'
export default {
	name: 'MM_Multiple_Relative_Tables',
	props: ['value', 'title', 'action', 'action_key', 'schema'],
	components: { MM_Options, MM_Relative_Posts },
	data() {
		return {
			currenData: []
		}
	},
	mounted() {
		this.currenData = this.value
	},
	methods: {
		addItem() {
			this.currenData.push({
				sheet: '',
				column: [],
				uniqueId: ''
			})
			this.$store.dispatch(this.action, this.currenData)
		},
		change() {
			this.$store.dispatch(this.action, this.currenData)
		},
		changeMainRelative(index) {
			this.currenData[index].column = []
			this.currenData[index].uniqueId = ''
			this.$store.dispatch(this.action, this.currenData)
		},
		deleteItem(item) {
			this.currenData = this.currenData.filter(obj => obj !== item)
			this.$store.dispatch(this.action, this.currenData)
		}
	}
}
</script>

<style scoped>
.slider_item_wrapper {
	border-bottom: 1px solid #e64a19;
}
</style>
