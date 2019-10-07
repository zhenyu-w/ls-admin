<template>
  <div>
    <sub-title :subTitle="'添加类目'" :isRefresh="false"></sub-title>
    <div class="body" v-loading="loading">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label="类目名称: " prop="navName">
          <el-input v-model.trim="ruleForm.navName"></el-input>
        </el-form-item>
        <el-form-item label="上级类目: " prop="parentId">
          <el-select :disabled="isChild" v-model="ruleForm.parentId" placeholder="请选择分类">
            <el-option :label="item.navName" :value="item.id" v-for="(item, index) in headerList" :key="index"></el-option>
          </el-select>
          <p class="form-tips" v-if="!isChild">不选择分类默认为顶级分类</p>
        </el-form-item>
        <el-form-item label="排序: " prop="navSort">
          <el-input v-model="ruleForm.navSort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否显示: " prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类目图标: " prop="navIcon" v-if="!isChild">
          <img :src="ruleForm.navIcon" alt class="form-img" v-if="ruleForm.navIcon">
          <div class="upload-btn-wrap">
            <label for="upload">
              <el-button size="small" type="primary">上传图片</el-button>
            </label>
            <input
              @change="uploadNavIcon"
              id="upload"
              type="file"
              class="upload-input"
              accept="image/jpeg, image/png"
            >
            <p class="form-tips">建议图标尺寸为18*18比例，图片只能为jpg、png格式</p>
          </div>
        </el-form-item>
        <el-form-item label="类目描述: " prop="navDesc">
          <el-input type="textarea" v-model="ruleForm.navDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">提交</el-button>
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
  name: "addHeader",
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    let navIconValid = (item, value, callback) => {
      if (!this.ruleForm.navIcon && !this.isChild) {
        callback(new Error("请上传类目图标"));
      } else {
        callback();
      }
    };
    return {
      headerList: [{ id: 0, navName: "顶级类目" }],
      isChild: false,
      ruleForm: {
        navName: "",
        parentId: 0,
        navSort: "",
        status: "0",
        navIcon: "",
        navDesc: ""
      },
      rules: {
        navName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        navIcon: [{ validator: navIconValid, trigger: "change" }]
      },
      loading: false,
      submitLoading: false
    };
  },
  created() {
    this.$http
      .post("merchantNavigation/query_navigation_type_tree", {})
      .then(res => {
        this.headerList = [...this.headerList, ...res];
        if (this.$route.query.parentId) {
          this.$set(
            this.ruleForm,
            "parentId",
            Number(this.$route.query.parentId)
          );
          this.isChild = true;
        }
      });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.addEdit("merchantNavigation/merchant_navigation_add");
        } else {
          return false;
        }
      });
    },
    uploadNavIcon(file) {
      this.uploadFile(file).then(res => {
        this.$set(this.ruleForm, "navIcon", res.imgUrl);
      });
    },
    addEdit(url) {
      this.$http.post(url, this.ruleForm).then(
        () => {
          this.$msgSuc("操作成功");
          setTimeout(() => {
            this.$router.push("/promotion/header");
            this.submitLoading = false;
          }, 500);
        },
        err => {
          this.$msgErr(err.msg);
          this.submitLoading = false;
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
