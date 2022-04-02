<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
            <v-icon 
            v-bind="attrs"
            v-on="on"
            color="black"
            >
             mdi-dots-horizontal</v-icon>
      </template>

      <v-card>
        <v-textarea
        label="Label"
        v-model="tex"
        :value="tex"
        ></v-textarea>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="editMessages"
          >
            Редактировать текст
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
      props:['text', 'user', 'id'],
    data () {
      return {
        dialog: false,
        tex:this.text
      }
    },
    
    methods:{
        editMessages(){
          console.log(this.uuid);
            let data = {text: this.tex, id:this.$store.state.user.id, uuid:this.id}
            this.$socket.emit('editMessage', data)
            this.dialog = false
        }
    }
  }
</script>