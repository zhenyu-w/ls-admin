<template>
  <div>
    <sub-title :subTitle="'评价详情'" :isClose="true" @close="back"></sub-title>
    <div class="body">
      <div class="comment-user flex">
        <div class="comment-user-center">
          <img src="https://img.xinzhibang168.com/FmR88ILyONmakl5P1khxHlEt3qxc.jpg" alt>
          <p class="text-center">{{tableData.userName}}</p>
        </div>
        <div class="flex-1 flex flex-col around">
          <p>商品：{{tableData.goodsName}}</p>
          <!-- <p>购买：肤色/M</p> -->
          <p>
            评价：
            <img
              v-for="(star,index) in tableData.commentLevel" :key="index"
              src="@/assets/starOn.png"
              class="imgsrc"
            >
            <img
              v-for="(star,index) in tableData.commentLevel1" :key="index"
              src="@/assets/starOff.png"
              class="imgsrc"
            >
          </p>
          <p>日期：{{tableData.createTime}}</p>
          <p>IP地址：{{tableData.commentIp}}</p>
        </div>
      </div>
      <div class="conter-right">
        <div class="content">
          {{tableData.commentContent}}
          <br>
          <span v-for="(i, index) in picArray" :key="index" class="clear">
            <img :src="i">
          </span>
        </div>
        <div class="review">
          <p class="font-16 gray bold">回复评价</p>
          <el-form
            class="form"
            ref="ruleForm"
            :model="ruleForm"
            label-width="100px"
            style="width: 500px;"
          >
            <el-form-item label="用户名: ">
              <el-input v-model="ruleForm.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="回复内容: ">
              <el-input
                type="textarea"
                :rows="7"
                class="textarea"
                v-model="ruleForm.commentContent"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="active" type="primary" @click="sure(ruleForm)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from "../../components/subTitile";
import mixin from "../../Utils/mixin";
var merchantName = JSON.parse(localStorage.userInfo).merchantName;
export default {
  name: "accountSetting",
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    return {
      tableData: "",
      picArray: "",
      ruleForm: {
        name: JSON.parse(localStorage.userInfo).merchantName,
        commentContent: ""
      }
    };
  },
  mounted() {
    this.$http
      .post("/merchantGoodsComment/merchant_goods_type_list_page", {
        id: this.$route.query.id
      })
      .then(res => {
        for (var i = 0; i < res.list.length; i++) {
          res.list[i].commentLevel1 = 5 - res.list[i].commentLevel;
        }
        this.tableData = res.list[0];
        if (this.tableData.imgUrl.length > 0) {
          this.picArray = this.tableData.imgUrl.split(",");
        }
      });
  },
  methods: {
    sure() {
      if (this.ruleForm.commentContent == "") {
        this.$msgSuc("请输入评价内容");
        return;
      }
      this.$http
        .post("/merchantGoodsComment/merchant_comment_reply", {
          commentReplyContent: this.ruleForm.commentContent,
          id: this.tableData.id
        })
        .then(res => {
          this.$msgSuc("回复成功");
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.comment-user {
  padding: 20px;
  // width: 300px;
  // display: inline-block;
  // float: left;
  // .comment-user-center{
  //   text-align: center;
  // }
  border-bottom: $border;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-top: 30px;
  }
  .imgsrc {
    width: 20px;
    height: 20px;
    margin: 0 0 -4px 0;
  }
  .flex {
    margin-left: 20px;
    p {
      color: $gray;
      font-size: 15px;
    }
  }
}
.around {
  p {
    margin-top: 10px;
  }
}
// .conter-right{
//   float: right;
// }
.content {
  padding: 20px;
  font-size: 15px;
  line-height: 28px;
  color: $gray;
  border-bottom: $border;
}
.comment-user {
  padding: 0 20px;
  border-bottom: 1px solid #dedede;
  display: block;
  height: 100%;
  float: left;
  border-top: 1px solid #dedede;
  border-left: 1px solid #dedede;
}
.comment-user-center {
  text-align: center;
}
.conter-right {
  display: inline-block;
  width: 70%;
  border: 1px solid #dedede;
  height: 100%;
}
.body {
  height: 100%;
  padding: 80px 0 0 0;
}
.content > div {
  height: 100%;
}
.textarea {
  resize: none;
}
.review {
  padding: 0 30px;
  margin-top: 30px;
  .form {
    margin-top: 30px;
  }
}
</style>