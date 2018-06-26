<template>
<div>
  <div v-if="usernameSet">
    <p v-if="isConnected">We're connected to the server!</p>
    <input id="txtName" @keyup.enter="sendMessage" @keyup='isTyping' v-model="txtInput" type="text">
    <ul id="example-1">
      <li :key='message'  v-for="message in messages">
      {{ message  }}
    </li>
  </ul>
  <ul id="typing">
    <li :key='user' v-for="user in Object.keys(typing)">
    <p v-if="typing[user]">{{ user  }} is typing...</p>
      </li>
    </ul>
  </div>
  <div v-if="!usernameSet">
    <input id="username" @keyup.enter="setUsername" v-model="username"
      type="text"
      placeholder="pick a username"/>
      <p v-if="badUsername">
        Username must have at least 4 characters and only contain alphanumeric characters
      </p>
  </div>
  <div v-if="!roomSet">
    <input id="room" @keyup.enter="setRoomNum" v-model="roomNum"
      type="number"
      placeholder="pick a room number 1 - 9"/>
      <p v-if="badroomNum">
        pick a single digit num 1 - 9
      </p>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://localhost:3000');
export default {
  data() {
    return {
      isConnected: false,
      socketMessage: '',
      txtInput: '',
      messages: [],
      username: '',
      usernameSet: false,
      typing: {},
      badUsername: false,
      roomNumSet: false,
      badRoomNum: false,
      room: 0,
    };
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },
    chatMessage(msg) {
      this.messages.push(`${msg.username || this.username}: ${msg.msg}`);
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
    },
    isTyping(username) {
      this.typing[username] = true;
    },
  },

  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', 'PING!');
    },
    sendMessage() {
      this.$socket.emit('chat message', this.username, this.txtInput);
      this.txtInput = '';
      this.typing[this.username] = false;
    },
    setUsername() {
      if (this.username.length >= 4 && /^[a-zA-Z0-9_]+$/.test(this.username)) {
        this.usernameSet = true;
        this.$socket.emit('userConnect', this.username);
      } else {
        this.badUsername = true;
      }
    },
    setRoomNum() {
      if (this.roomNum >= 0 && this.roomNum <= 9) {
        console.log('Joining room: ', this.roomNum);
        this.room = this.roomNum;
        this.usernameSet = true;
        this.$socket.emit('join room', { room: this.roomNum });
      } else {
        this.badRoomNum = true;
      }
    },
    isTyping() {
      this.$socket.emit('isTyping', this.username);
    },
    displayTyping() {
      this.typing[this.username] = true;
    },
  },
};
</script>

<style>
li {
  list-style-type: none;
}
</style>
