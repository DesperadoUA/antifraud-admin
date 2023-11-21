<template>
	<div>
		<v-container class="container--fluid">
			<v-row>
				<v-col class="offset-1 col-10 mt-10">
					<h1 class="page_title font-podkova-bold">Join Tables</h1>
				</v-col>
			</v-row>
			<v-row>
				<v-col class="offset-1 col-10 mt-1 mb-5">
					<h2 class="text-center font-podkova-bold mb-5">Set main table</h2>
					<MM_Options
						v-if="getAllSheets.length"
						value=""
						:all_value="getAllSheets"
						title="Main table"
						action="join-tables/setMainSheet"
					/>
					<MM_Relative_Posts
						v-if="mainTabColumn.length && isShowMainTableColumn"
						:all_value="mainTabColumn"
						:current_value="mainTabColumnValue"
						action="join-tables/setMainSheetColumnValue"
						title="Column main table"
					/>
					<MM_Options
						v-if="mainTabColumn.length && isShowMainTableColumn"
						value=""
						:all_value="mainTabColumn"
						title="Unique column"
						action="join-tables/setMainTabColumnId"
					/>
				</v-col>
			</v-row>
			<v-row v-if="Object.keys(getSchema).length">
				<v-col class="offset-1 col-10 mt-1 mb-5">
					<h2 class="text-center font-podkova-bold mb-5">Set relative table</h2>
					<MM_Multiple_Relative_Tables
						:value="[]"
						title="Relative table"
						action="join-tables/setRelativeSheets"
						action_key=""
						:schema="getSchema"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col class="offset-1 col-10 mt-1 mb-5">
					<h2 class="text-center font-podkova-bold mb-5">Set total table</h2>
					<MM_Options
						v-if="getAllSheets.length"
						value=""
						:all_value="getAllSheets"
						title="Main table"
						action="join-tables/setTotalSheet"
					/>
				</v-col>
			</v-row>
		</v-container>
		<v-container>
			<v-row>
				<v-col class="offset-1 col-10 mt-5 mb-10 text-center">
					<v-btn class="font-podkova-bold deep-orange darken-2" text @click="run">
						<v-icon left color="white">mdi-content-save</v-icon>
						RUN
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
		<v-container class="container--fluid">
			<v-simple-table fixed-header>
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left" v-for="(value, index) in tableHeaders" :key="index">
								{{ value }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(value, index) in tableData" :key="index">
							<td v-for="(valueItem, indexItem) in value" :key="indexItem">{{ valueItem }}</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</v-container>
		<v-snackbar v-model="snackbarStatus">
			<div class="font-podkova-bold text-center">{{ snackbarText }}</div>
			<template v-slot:actions>
				<v-btn color="pink" variant="text" @click="snackbar = false">
					Close
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script>
import Builder from '~/DAL/builder'
import MM_Options from '~/components/lib/MM_Options'
import MM_Relative_Posts from '~/components/lib/MM_Relative_Posts'
import MM_Multiple_Relative_Tables from '~/components/lib/MM_Multiple_Relative_Tables'
import SnackBar from '~/components/templates/snackbar'

export default {
	name: 'join-tables',
	layout: 'admin',
	data() {
		return {
			isShowMainTableColumn: true,
			snackbarStatus: false,
			snackbarText: '',
			snackbarTimeout: 5000,
			tableHeaders: [],
			tableData: []
		}
	},
	components: { MM_Options, MM_Relative_Posts, MM_Multiple_Relative_Tables, SnackBar },
	computed: {
		getAllSheets() {
			return this.$store.getters['join-tables/getSheets']
		},
		getMainSheet() {
			return this.$store.getters['join-tables/getMainSheet']
		},
		mainTabColumn() {
			return this.$store.getters['join-tables/getMainTabColumn']
		},
		mainTabColumnValue() {
			return this.$store.getters['join-tables/getMainSheetColumnValue']
		},
		getMainTabColumnId() {
			return this.$store.getters['join-tables/getMainTabColumnId']
		},
		getSchema() {
			return this.$store.getters['join-tables/getSchema']
		}
	},
	methods: {
		async run() {
			const state = this.$store.getters['join-tables/getJoinTables']
			const errors = []
			const schema = {
				main: {},
				relatives: [],
				total: ''
			}
			if (!state.mainSheet) errors.push('Set Main sheet')
			else schema.main.tableName = state.mainSheet

			if (!state.mainSheetColumnValue.length) errors.push('Set main columns')
			else schema.main.rows = state.mainSheetColumnValue

			if (!state.mainTabColumnId) errors.push('Set Main sheet unique id')
			else schema.main.fieldId = state.mainTabColumnId

			if (!state.totalSheet) errors.push('Set total sheet')
			else schema.total = state.totalSheet

			if (!state.relative.length) errors.push('Set relatives')

			const candidate = state.relative.filter(item => {
				return item.sheet === '' || item.column.length === 0 || item.uniqueId === ''
			})
			if (candidate.length) errors.push('Not valid relative sheet')
			if (errors.length) {
				this.snackbarText = errors[0]
				this.snackbarStatus = true
			} else {
				schema.relatives = state.relative.map(item => {
					return {
						tableName: item.sheet,
						rows: item.column,
						fieldId: item.uniqueId
					}
				})
				const request = new Builder()
				const result = await request
					.postType('report')
					.url('result')
					.setData({ schema })
					.get()
				if (result.data.status === 'ok' && result.data.body.length) {
					this.tableHeaders = result.data.body.shift()
					this.tableData = result.data.body
					setTimeout(() => {
						navigator.clipboard.writeText(document.querySelector('table').innerText)
						console.log(document.querySelector('table').innerText)
					}, 1500)
				}
			}
		}
	},
	watch: {
		async getMainSheet() {
			this.isShowMainTableColumn = false
			this.$store.dispatch('join-tables/setMainSheetColumnValue', [])
			await this.$store.dispatch('join-tables/setMainTabColumn', this.getMainSheet)
			this.isShowMainTableColumn = true
		}
	},
	async mounted() {
		await this.$store.dispatch('join-tables/setSheets')
		await this.$store.dispatch('join-tables/setSchemas')
	}
}
</script>

<style scoped></style>
