<template>
    <div class="d-flex">
        {{ write }}
        <v-text-field
            @blur="inputChange"
            @input="inputWrite"
            label="Введите сообщение"
            outline
            v-model="text"
            @keydown.enter="send"
        />
        <input
            ref="fileinput"
            type="file"
            accept="image/*"
            @change="onFileChange"
        />
        <img height="30" :src="imgSrc" alt="" />
    </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
    data: () => ({
        text: "",
        flag: false,
        file: null,
        imgSrc: null,
        fileName: null
    }),
    computed: mapState(["user", "write"]),
    methods: {
        ...mapMutations(["setWrite"]),
        onFileChange(event) {
            let file = event.target.files[0];
            let obj;
            let reader = new FileReader();
            reader.onload = e => {
                var buffer = e.target.result;
            };
            reader.readAsDataURL(file);
            this.file = file;
            this.fileName = file.name;

            //  obj = {
            //         file:file.name,
            //         id:this.$store.state.user.id,
            //         buffer: this.file
            //       }
            // this.$socket.emit('createMessage', obj);
        },
        send(e) {
            let obj = {
                text: this.text,
                id: this.$store.state.user.id,
                uuid: this.$store.state.user.id
            };
            if (this.file) {
                obj.buffer = this.file;
                obj.file = this.fileName;
            }
            this.$socket.emit("createMessage", obj, data => {
                if (typeof data === "string") {
                    console.error(data);
                } else {
                    this.text = "";
                    this.$refs.fileinput.value = "";
                    this.file = null;
                }
            });
            e.target.blur();
        },
        inputWrite() {
            this.$socket.emit("inputWrite", this.user);
        },
        inputChange() {
            this.$socket.emit("inputWriteFalse", this.user);
        }
    }
};
</script>
