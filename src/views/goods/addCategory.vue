<template>
  <div>
    <sub-title :subTitle="'添加分类'" :isRefresh="false"></sub-title>
    <div class="body" v-loading="loading">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label="分类名称: " prop="typeName">
          <el-input v-model="ruleForm.typeName"></el-input>
        </el-form-item>
        <el-form-item label="上级分类: " prop="parentId">
          <el-select :disabled="isAddCategory" v-model="ruleForm.parentId" placeholder="请选择分类">
            <el-option :label="item.typeName" :value="item.id" v-for="(item, index) in categoryList" :key="index"></el-option>
          </el-select>
          <p class="form-tips" v-if="!isAddCategory">不选择分类默认为顶级分类</p>
        </el-form-item>
        <el-form-item label="数量单位: " prop="goodsUnit">
          <el-input v-model="ruleForm.goodsUnit"></el-input>
        </el-form-item>
        <el-form-item label="排序: " prop="goodsSort">
          <el-input v-model="ruleForm.goodsSort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否显示: " prop="showStatus">
          <el-radio-group v-model="ruleForm.showStatus">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--<el-form-item label="分类图标: " prop="typeIcon">
          <img :src="ruleForm.typeIcon" alt="" class="form-img" v-if="ruleForm.typeIcon">
          <div class="upload-btn-wrap">
            <label for="upload"><el-button size="small" type="primary">上传图片</el-button></label>
            <input @change="uploadTypeIcon" id="upload" type="file" class="upload-input" accept="image/jpeg, image/png">
            <p class="form-tips">图标尺寸为18*18比例，大小不能超过200KB，图片只能为jpg、png、gif格式</p>
          </div>
        </el-form-item>-->
        <el-form-item label="分类描述: " prop="typeDesc">
          <el-input type="textarea" v-model="ruleForm.typeDesc"></el-input>
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
  name: "addCategory",
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    return {
      categoryList: [{ id: 0, typeName: "顶级分类" }],
      isAddCategory: false,
      ruleForm: {
        typeName: "",
        parentId: 0,
        goodsUnit: "",
        goodsSort: "",
        showStatus: "",
        typeIcon: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ]
      },
      loading: false
    };
  },
  created() {
    this.$http("merchantGoodsType/query_goods_type_tree").then(res => {
      this.categoryList = [...this.categoryList, ...res];
      if (this.$route.query.id) {
        this.isAdd = false;
        this.loading = true;
        this.$http
          .post("merchantGoodsType/merchant_goods_type_by_id", {
            id: this.$route.query.id
          })
          .then(
            res => {
              this.$set(this.ruleForm, "typeName", res.typeName);
              this.$set(this.ruleForm, "parentId", res.parentId);
              this.$set(this.ruleForm, "goodsUnit", res.goodsUnit);
              this.$set(this.ruleForm, "goodsSort", res.goodsSort);
              this.$set(this.ruleForm, "showStatus", res.showStatus);
              this.$set(this.ruleForm, "typeIcon", res.typeIcon);
              console.log(this.ruleForm);
            },
            err => {
              this.$msgErr(err.msg);
            }
          )
          .finally(() => {
            this.loading = false;
          });
      }
      if (this.$route.query.parentId) {
        this.$set(
          this.ruleForm,
          "parentId",
          Number(this.$route.query.parentId)
        );
        this.isAddCategory = true;
      }
    });
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addEdit("merchantGoodsType/merchant_add_goods_type");
          } else {
            this.ruleForm.id = this.$route.query.id;
            this.addEdit("merchantGoodsType/merchant_goods_type_update");
          }
        } else {
          return false;
        }
      });
    },
    uploadTypeIcon(file) {
      this.uploadFile(file).then(res => {
        this.$set(this.ruleForm, "typeIcon", res.imgUrl);
      });
    },
    addEdit(url) {
      this.$http.post(url, this.ruleForm).then(
        () => {
          this.$msgSuc("操作成功");
          setTimeout(() => {
            this.$router.push("/goods/category");
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
