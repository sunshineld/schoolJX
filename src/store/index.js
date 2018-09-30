import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const state = {
	num: 5,
	loading: false,
	cacheList: [],
}

const mutations = {
	add(state) {
		state.num++
	},
	minus(state) {
		state.num--
	},
	// changeLoading (state, status) {
	// 	if (typeof status !== 'boolean') {
	// 		throw new Error('状态错误')
	// 	}
	// 	state.loading = status
	// },
	startLoad (state) {
		state.loading = true
	},
	endLoad (state) {
		state.loading = false
	},
	pushCacheList (state, name) {
		if (state.cacheList.indexOf(name) !== -1) {
			return
		}
		state.cacheList.push(name)
	},
	removeCacheList (state, name) {
		let index = state.cacheList.indexOf(name)
		if (index !== -1) {
			state.cacheList.splice(index, 1)
		} else {
			console.warn('[removeCacheList] 错误的name')
		}
	},
	clearCacheList (state) {
		state.cacheList = []
	},
}

const actions = {
	add({commit}) {
		commit('add')
	},
	minus({commit}) {
		commit('minus')
	}
}

const getters = { 
    num: function(state) {
        return state.num
	}
}


export default new vuex.Store({
	state,
	mutations,
	actions,
	getters
})