  import Vue from 'vue'
  export const state = () => ({
	user: {},
	messages: [],
	users: [],
	write:false
  })

  export const mutations = {
	setUser(state, user) {
		state.user = user
	},
	clearData(state) {
		state.user = {}
		state.messages = []
		state.users = []
	},
	setWrite(state){
		state.write = false
	},
	editClientMessage(state, payload){
		let idx =  state.messages.findIndex((value)=>{
			if(value.id){
				return value.uuid == payload.uuid
			}
		})
		let newMessage = state.messages[idx]
		newMessage.text = payload.text
		// state.messages.forEach((e, i) => {
		// 	if(i == idx){
		// 		e = Object.assign({}, e, payload.text)
		// 	}
		// });	
		// state.messages = Object.assign({}, state.messages, payload.text)
		Vue.set(state.messages, idx, newMessage)
	},
	SOCKET_newMessage(state, message) {
		state.messages.push(message)
	},
	SOCKET_updateUsers(state, users) {
		state.users = users
	},
	SOCKET_inputSocket(state, name){
		state.write = name;
	},
	

  }
  export const actions = {
	SOCKET_editClientMessage({commit}, payload){
		console.log('[ay', payload);
		commit('editClientMessage', payload)
	}
  }
  export const getters = {
	messages(state){
		return state.messages
	}
  }
