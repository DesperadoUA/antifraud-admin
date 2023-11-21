import Builder from '~/DAL/builder'
export const state = () => ({
	joinTables: {
		allSheets: [],
		mainSheet: '',
		mainSheetColumnValue: [],
		mainTabColumn: [],
		mainTabColumnId: '',
		totalSheet: '',
		relative: []
	},
	schema: {}
})
export const mutations = {
	setSheets(state, data) {
		state.joinTables.allSheets = data
	},
	setMainSheet(state, data) {
		state.joinTables.mainSheet = data
	},
	setMainTabColumn(state, data) {
		state.joinTables.mainTabColumn = data
	},
	setMainSheetColumnValue(state, data) {
		state.joinTables.mainSheetColumnValue = data
	},
	setMainTabColumnId(state, data) {
		state.joinTables.mainTabColumnId = data
	},
	setTotalSheet(state, data) {
		state.joinTables.totalSheet = data
	},
	setRelativeSheets(state, data) {
		state.joinTables.relative = data
	},
	setSchemas(state, data) {
		state.schema = data
	}
}
export const actions = {
	async setSheets({ commit }, data) {
		const request = new Builder()
		const result = await request
			.postType('report')
			.url('all-tabs')
			.get()
		if (result.data.status === 'ok') commit('setSheets', result.data.body)
	},
	setMainSheet({ commit }, data) {
		if (data.value) commit('setMainSheet', data.value)
	},
	setTotalSheet({ commit }, data) {
		if (data.value) commit('setTotalSheet', data.value)
	},
	setMainTabColumnId({ commit }, data) {
		if (data.value) commit('setMainTabColumnId', data.value)
	},
	setRelativeSheets({ commit }, data) {
		if (data) commit('setRelativeSheets', data)
	},
	setMainSheetColumnValue({ commit }, data) {
		commit('setMainSheetColumnValue', data)
	},
	async setMainTabColumn({ commit }, data) {
		const request = new Builder()
		const result = await request
			.postType('report')
			.url('tab-column')
			.setData({ tabName: data })
			.get()
		if (result.data.status === 'ok') commit('setMainTabColumn', result.data.body)
	},
	async setSchemas({ commit }, data) {
		const schemas = {}
		const request = new Builder()
		const result = await request
			.postType('report')
			.url('all-tabs')
			.get()
		for await (const tab of result.data.body) {
			const request = new Builder()
			const result = await request
				.postType('report')
				.url('tab-column')
				.setData({ tabName: tab })
				.get()
			schemas[tab] = result.data.body
		}
		commit('setSchemas', schemas)
	}
}
export const getters = {
	getSheets(state) {
		return state.joinTables.allSheets
	},
	getMainSheet(state) {
		return state.joinTables.mainSheet
	},
	getTotalSheet(state) {
		return state.joinTables.totalSheet
	},
	getMainTabColumn(state) {
		return state.joinTables.mainTabColumn
	},
	getMainSheetColumnValue(state) {
		return state.joinTables.mainSheetColumnValue
	},
	getMainTabColumnId(state) {
		return state.joinTables.mainTabColumnId
	},
	getJoinTables(state) {
		return state.joinTables
	},
	getSchema(state) {
		return state.schema
	}
}
