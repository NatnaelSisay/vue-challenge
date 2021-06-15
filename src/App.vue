/* eslint-disable no-unused-vars */

<template>
	<div id="app">
		<input class="input-field" v-model="inputValue" type="text" />
		<div>
			<button class="btn save" v-on:click="saveToIndexDB">Save</button>
			<button class="btn refresh" v-on:click="refresh">Refresh</button>
		</div>
	</div>
</template>

<script>
import { create_db, addTodDB, getData } from './utils/db.js'

export default {
	name: 'App',
	components: {},

	data() {
		return {
			inputValue: ''
		}
	},
	mounted() {
		create_db()
		setTimeout(() => {
			if (getData()) {
				getData().then((result) => {
					this.inputValue = result
				})
			}
		}, 1000)
	},
	methods: {
		saveToIndexDB() {
			console.log(this.inputValue)
			addTodDB(this.inputValue)
		},
		refresh() {
			console.log('refresh')
			location.reload()
		}
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

.input-field {
	padding: 0.5rem;
	font-size: 18px;
}

.btn {
	border: 0;
	padding: 0.5rem 1rem;
	font-weight: bold;
	font-size: 16px;
	margin: 1rem;
	border-radius: 25px;
	cursor: pointer;
}

.save {
	background-color: green;
	color: white;
}
.refresh {
	background-color: lightgray;
	color: black;
}
</style>
