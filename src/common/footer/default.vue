<!--
 * @file
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since 2020-10-16 01:14:34
-->
<template>
<div style="display: none">111111</div>
</template>
<script>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component({
  name: "index-footer"
})
export default class extends Vue {
    mounted() {
        console.log('index-footer mounted')
    }
}
</script>
