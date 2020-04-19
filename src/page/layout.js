import Vue from "vue";
import navbar from "../common/navbar";
import breadcrumb from "../common/breadcrumb";
import govideo from "./video";
import gohead from "../common/head";
import gomarkdown from "../common/markdown";
import list from "./list";
import gotext from "./text";
import { getQueryString, get_filex } from "../utils/AcrouUtil";

var layout = Vue.component("layout", {
  data: function () {
    return {
      path: "",
      show: "list",
      text: { file: {}, path: "" },
      headmd: { display: false, file: {}, path: "" },
      readmemd: { display: false, file: {}, path: "" },
    };
  },
  components: {
    navbar: navbar,
    breadcrumb: breadcrumb,
    gohead: gohead,
    goheadmd: gomarkdown,
    goreadmemd: gomarkdown,
    list: list,
    govideo: govideo,
    gotext: gotext,
  },
  methods: {
    render(config) {
      let path = config.path;
      this.$refs.navbar.siteName = config.siteName;
      this.$refs.breadcrumb.render(path);
      var param = window.location.search;
      if (param.indexOf("?a=view") < 0) {
        this.show = "list";
        this.$refs.list.render(path, getQueryString(param, "q"));
      } else {
        var name = path.split("/").pop();
        var ext = name.split(".").pop().toLowerCase();
        if (
          "|html|php|css|go|java|js|json|txt|sh|md|".indexOf(`|${ext}|`) >= 0
        ) {
          this.show = "text";
          this.text = {
            path: path,
            file: {},
          };
        }

        if ("|mp4|webm|mkv|".indexOf(`|${ext}|`) >= 0) {
          this.show = "video";
          this.$refs.govideo.render(path);
        }

        if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
          console.log("file_image");
          // return file_image(path);
        }
      }
    },
    setHeadmd(val) {
      this.headmd = val;
    },
    setReadmemd(val){
      this.readmemd = val;
    }
  },
  template: `
    <div>
      <navbar ref="navbar"></navbar>
      <div class="container">
        <goheadmd :option="headmd" v-show="headmd.display" style="padding-top: 10px;"></goheadmd>
        <breadcrumb ref="breadcrumb"></breadcrumb>
        <list ref="list" v-on:headmd="setHeadmd" v-on:readmemd="setReadmemd" v-show="show=='list'"></list>
        <hr/>
        <goreadmemd :option="readmemd" v-show="readmemd.display"></goreadmemd>
        <govideo ref="govideo" v-show="show=='video'"></govideo>
        <gotext :option="text" v-show="show=='text'"></gotext>
      </div>
    </div>
  `,
});

export default layout;
