<template>
  <div>
    <sub-title :subTitle="'添加图片库'" :isRefresh="false"></sub-title>
    <div class="body">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label="相册名称: " prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="相册封面: " prop="cover">
          <img :src="ruleForm.cover" alt class="form-img" v-if="ruleForm.cover">
          <div class="upload-btn-wrap">
            <label for="upload">
              <el-button type="primary" size="small">上传图片</el-button>
            </label>
            <input
              id="upload"
              type="file"
              class="upload-input"
              accept="image/jpeg, image/png"
              @change="uploadLogo"
            >
            <p class="form-tips">只能上传jpg/png格式文件，文件不能超过50kb</p>
          </div>
        </el-form-item>
        <el-form-item label="排序: " prop="sorting">
          <el-input v-model="ruleForm.sorting" type="number"></el-input>
        </el-form-item>
        <el-form-item label="相册描述: " prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subTitle from "../../components/subTitile";
import mixin from "../../Utils/mixin";
export default {
  name: "addImage",
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    let validCover = (item, value, callback) => {
      if (!this.ruleForm.cover) {
        callback(new Error("请上传相册封面"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        cover: "",
        sorting: "",
        description: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入相册名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        cover: [{ validator: validCover, required: true, trigger: "change" }]
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      this.$http
        .post(
          "merchant_goods_galleries/query_by_id",
          {
            id: this.$route.query.id
          },
          { type: "form" }
        )
        .then(
          res => {
            this.isAdd = false;
            this.$set(this.ruleForm, "name", res.name);
            this.$set(this.ruleForm, "cover", res.cover);
            this.$set(this.ruleForm, "sorting", res.sorting);
            this.$set(this.ruleForm, "description", res.description);
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
    }
  },
  methods: {
    uploadLogo(file) {
      this.uploadFile(file).then(res => {
        this.$set(this.ruleForm, "cover", res.imgUrl);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addEdit("merchant_goods_galleries/add");
          } else {
            this.$set(this.ruleForm, "id", this.$route.query.id);
            this.addEdit("merchant_goods_galleries/update");
          }
        } else {
          return false;
        }
      });
    },
    addEdit(url) {
      this.$http.post(url, this.ruleForm).then(
        () => {
          this.$msgSuc("提交成功");
          setTimeout(() => {
            this.$router.push("/goods/image");
          }, 500);
        },
        err => {
          this.$msgErr(err.msg);
        }
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.form {
  width: 600px;
  .form-tips {
    font-size: 12px;
    color: $gray;
  }
}
.form-tips {
  font-size: 12px;
  color: $gray;
  line-height: 16px;
  margin-top: 5px;
}
.form-select {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-select {
    width: 170px;
    margin-right: 20px;
  }
  span {
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>