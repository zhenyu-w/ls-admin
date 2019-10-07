<template>
  <div>
    <sub-title :subTitle="'添加发货点'" :isRefresh="false"></sub-title>
    <div class="body">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label="发货点名称: " prop="returnPname">
          <el-input v-model="ruleForm.returnPname"></el-input>
        </el-form-item>
        <el-form-item label="发货人姓名: " prop="returnName">
          <el-input v-model="ruleForm.returnName"></el-input>
        </el-form-item>
        <el-form-item label="详细地址: " prop="returnAddress">
          <el-input type="textarea" v-model="ruleForm.returnAddress"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="returnPhone">
          <el-input type="textarea" v-model="ruleForm.returnPhone"></el-input>
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
  name: "addBrand",
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    let validLogo = (item, value, callback) => {
      if (!this.ruleForm.logo) {
        callback(new Error("请上传品牌logo"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        returnPname: "",
        returnName: "",
        returnAddress: "",
        returnPhone: ""
      },
      rules: {
        returnPname: [
          { required: true, message: "请输入发货点名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        returnName: [
          { required: true, message: "请输入发货人姓名", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        returnAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        returnPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      this.$http
        .post("/return_send/query_By_Id ", {
          id: this.$route.query.id
        })
        .then(
          res => {
            this.isAdd = false;
            this.$set(this.ruleForm, "returnPname", res.returnPname);
            this.$set(this.ruleForm, "returnName", res.returnName);
            this.$set(this.ruleForm, "returnAddress", res.returnAddress);
            this.$set(this.ruleForm, "returnPhone", res.returnPhone);
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
        this.$set(this.ruleForm, "logo", res.imgUrl);
      });
    },
    uploadAreaLogo(file) {
      this.uploadFile(file).then(res => {
        this.$set(this.ruleForm, "areaLogo", res.imgUrl);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        this.ruleForm.merchantId = JSON.parse(
          this.$store.getters.userInfo
        ).merchantId;
        if (valid) {
          if (this.isAdd) {
            this.addEdit("/return_send/add_or_update");
          } else {
            this.$set(this.ruleForm, "id", this.$route.query.id);
            this.addEdit("/return_send/add_or_update");
          }
        } else {
          return false;
        }
      });
    },
    addEdit(url) {
      var reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
      if (!reg.test(this.ruleForm.returnPhone)) {
        this.$msgErr("手机格式不正确");
        return false;
      }
      this.$http.post(url, this.ruleForm).then(
        () => {
          this.$msgSuc("提交成功");
          setTimeout(() => {
            this.$router.push("/order/address");
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
.upload-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
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