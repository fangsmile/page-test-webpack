<!--
 * @file iframe
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since 2020-09-10 14:09:25
-->
<template>
    <iframe
    ref="iframe"
    :class="Attr.class"
    :src="Attr.src"
    :frameborder="Attr.frameborder"
    :name="Attr.name"
    :scrolling="Attr.scrolling"
    :width="Attr.width"
    :height="Attr.height"
    :marginheight="Attr.marginheight"
    :marginwidth="Attr.marginwidth"></iframe>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
interface Attr{
    class?:any;
    src:string;
    frameborder?:number;
    name?:string;
    scrolling?:string;
    width?:string;
    height?:string;
    marginheight?:number;
    marginwidth?:number;
}
@Component({
    name:'IFrame'
})
export default class IFrame extends Vue {
    @Prop()
    attr:Attr;
    get Attr(){
        return {
            class: this.attr.class || '',
            src: this.attr.src,
            frameborder: this.attr.frameborder || 0,
            name: this.attr.name || '',
            scrolling: this.attr.scrolling || 'no',
            width: this.attr.width || '100%',
            height: this.attr.height || '100%',
            marginheight: this.attr.marginheight || 0,
            marginwidth: this.attr.marginwidth || 0
        }
    }
    postMessage(message){
        this.$ref.iframe.postMessage(message)
    }
}
</script>
<style>

</style>