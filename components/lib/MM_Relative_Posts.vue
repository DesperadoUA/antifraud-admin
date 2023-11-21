<template>
	<v-container class="container--fluid pa-0">
		<v-row>
			<v-col class="offset-1 col-10 font-podkova-bold blue-grey darken-4">
				<v-expansion-panels inset>
					<v-expansion-panel>
						<v-expansion-panel-header>{{ title }}</v-expansion-panel-header>
						<v-expansion-panel-content class="pt-4">
							<v-combobox
								v-model="chips"
								:items="items"
								chips
								clearable
								label="Relative"
								multiple
								prepend-icon="mdi-filter-variant"
								solo
							>
								<template v-slot:selection="{ attrs, item, select, selected }">
									<v-chip v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
										<strong>{{ item }}</strong>
									</v-chip>
								</template>
							</v-combobox>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
/**
 * value{
 *   current_value: ['title_1', 'title_2', 'title_3']
 *   all_value: ['title_1', 'title_2', 'title_3', 'title_4', 'title_5']
 * }
 * **/
export default {
	name: 'MM_Relative_Posts',
	props: ['current_value', 'title', 'action', 'multiple', 'all_value'],
	data() {
		return {
			chips: [],
			items: []
		}
	},
	methods: {
		remove(item) {
			this.chips.splice(this.chips.indexOf(item), 1)
			this.chips = [...this.chips]
		}
	},
	watch: {
		chips() {
			const currenData = {
				value: this.chips
			}
			this.$store.dispatch(this.action, currenData.value)
		}
	},
	mounted() {
		this.chips = this.current_value
		this.items = this.all_value
	}
}
</script>

<style scoped></style>
