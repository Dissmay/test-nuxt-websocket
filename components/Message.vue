<template>
  <div>
    <div v-if="name === 'admin'" class="system">
      <p class="text-xs-center">{{text}}</p>
      <hr>
    </div>
    <div v-else class="wrap">
      <div class="mes" :class="{owner}">
        <small>
          <strong>{{name}}</strong>
        </small>
        <p>{{text}}</p>
        <img v-if="img" height="100" width="100" :src="img" alt="">
        <v-spacer></v-spacer>
        <Dialog v-if="owner" :text="text" :user="user" :id="uuid" class="dialog"/>
      </div>
    </div>
    
  </div>
</template>

<script>
import {mapState} from 'vuex';
import Dialog from './Dialog';
export default {
  props: {
    name: String,
    text: String,
    img: String,
    owner: {
      type: Boolean,
      default: false
    },
    uuid:String
  },
   computed: mapState(["user"]),
  components:{
    Dialog
  }
};
</script>

<style lang="stylus" scoped>
.dialog{
  position absolute;
  top 0;
  right 0;
}
.system {
  margin-bottom: 1rem;

  p {
    margin-bottom: 1rem;
  }
}

.wrap {
  display: flex;
  flex-direction: column;
}

.mes {
  padding: 1rem;
  width: 60%;
  margin: 0 1rem;
  box-shadow: 0 1px 0 0 rgba(50, 50, 50, 0.3);
  border-radius: 4px;
  background: #1976d2;
  position: relative;
  margin-bottom: 1rem;

  p {
    margin-bottom: 0;
  }
}

.owner {
  background: #ffffff;
  color: #000000;
  align-self: flex-end;
}
</style>

