<template>
  <div>
    <sub-title :subTitle="'订单列表'" :isRefresh="false"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-14">退货商品</span>
      </div>
      <el-table
        class="mallTable"
        :data="tableData2"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="商品图片" width="130">
          <template slot-scope="scope">
            <img :src="scope.row.goodsPic">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="200">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column label="价格/货号" width="130">
          <template slot-scope="scope">{{ scope.row.goodsPrice }}</template>
        </el-table-column>
        <el-table-column label="属性" width="130">
          <template
            slot-scope="scope"
          >{{ scope.row.goodsSize }}-{{scope.row.goodsBrand}}-{{scope.row.goodsColor}}</template>
        </el-table-column>
        <el-table-column label="数量" width="130">
          <template slot-scope="scope">{{ scope.row.buyNum }}</template>
        </el-table-column>
        <el-table-column label="小计">
          <template slot-scope="scope">{{ scope.row.totalMoney }}</template>
        </el-table-column>
      </el-table>
      <div class="box-title box-title-second flex between h-center">
        <span class="font-14">服务单信息</span>
      </div>
      <table class="table-middle" border="1">
        <tbody>
          <tr>
            <td>服务单号</td>
            <td>{{tableData3.code}}</td>
          </tr>
          <tr>
            <td>申请状态</td>
            <td v-if="tableData3.status == 1">未处理</td>
            <td v-else-if="tableData3.status == 2">同意退货</td>
            <td v-else>拒绝退货</td>
          </tr>
          <tr>
            <td>订单编号</td>
            <td>{{tableData3.orderCode}}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>{{tableData3.creatTime}}</td>
          </tr>
          <tr>
            <td>用户账号</td>
            <td>{{tableData3.mobilePhone}}</td>
          </tr>
          <tr>
            <td>联系人</td>
            <td>{{tableData3.contact}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{tableData3.phone}}</td>
          </tr>
          <tr>
            <td>退货原因</td>
            <td>{{tableData3.returnReason}}</td>
          </tr>
          <tr>
            <td>问题描述</td>
            <td>{{tableData3.problemDescription}}</td>
          </tr>
          <tr>
            <td>凭证照片</td>
            <td>
              <span v-for="(i, index) in picArray" :key="index" class="clear">
                <img :src="i">
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table-middle" border="1">
        <tbody>
          <tr>
            <td>订单金额</td>
            <td>{{tableData3.applicationReturnMoney}}</td>
          </tr>
          <!-- <tr>
                      <td>退运费</td>
                      <td>
                          <el-radio v-model="ruleForm.name" label="1">备选项</el-radio>
                          <el-radio v-model="ruleForm.name" label="2">备选项</el-radio>
                    </td>
          </tr>-->
          <tr>
            <td>确认退款金额</td>
            <td>
              <!-- <el-form :model="ruleForm"  ref="ruleForm" label-width="50px" class="form">
                          <el-form-item label=" " prop="returnPname">
                            <el-input v-model="ruleForm.returnMoney"></el-input>
                          </el-form-item>
              </el-form>-->
              <span class="returnMoney">
                <el-input v-model="returnMoney" @keyup.native="returnMoneychange"></el-input>
              </span>
            </td>
            <!-- <td><input type="text"  :value="tableData3.returnMoney" /></td> -->
          </tr>
          <!-- <tr>
                      <td>选择收货点</td>
                      <td>
                          <el-select placeholder="请选择品牌">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                          </el-select>
                      </td>
          </tr>-->
          <tr>
            <td>选择收货点</td>
            <td>
              <el-select v-model="typeId" @change="search" placeholder="请选择收货点">
                <el-option v-for="(item, index) in returnSend" :key="index" :label="item.returnPname" :value="item.id"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>收货人姓名</td>
            <td>{{returnAdress.returnName || ''}}</td>
          </tr>
          <!-- <tr>
                      <td>所在区域</td>
                      <td>
                          <div class="area">
                            <area-select type="text"  :level="2" v-model="selected" ></area-select>
                          </div>
                      </td>
          </tr>-->
          <tr>
            <td>详细地址</td>
            <td>{{returnAdress.returnAddress || ''}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{returnAdress.returnPhone || ''}}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tr>
          <td>处理备注</td>
          <!-- <input type="text" v-model="resolveRemark" /> -->
          <td>
            <span class="returnMoney">
              <el-input v-model="resolveRemark"></el-input>
            </span>
          </td>
        </tr>
      </table>
      <el-button type="primary" class="sure" @click="sure(tableData3.id)">确定退货</el-button>
      <el-button type="primary" class="cancel" @click="cancel(tableData3.id)">拒绝退货</el-button>
    </div>
  </div>
</template>
<script>
import subTitle from "../../components/subTitile";
import mixin from "../../Utils/mixin";
import pagination from "../../components/pagination";
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";
export default {
  mixins: [mixin],
  name: "accountSetting",
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      input: "",
      resolveRemark: "",
      selected: ["440000", "440300", "440305"],
      pca: pca,
      pcaa: pcaa,
      picArray: "",
      ruleForm: {},
      tableData3: "",
      tableData2: [],
      returnSend: "",
      typeId: "",
      returnAdress: "",
      returnMoney: "",
      returnOriginal: ""
    };
  },
  created: function() {
    this.$http
      .post("/return_send/query_for_page", {
        currentPage: 1,
        pageSize: 10000,
        merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
      })
      .then(res => {
        this.returnSend = res.list;
      });
    this.$http
      .post("/merchant_return_goods/query_By_Id", {
        id: this.$route.query.id
      })
      .then(
        res => {
          this.tableData3 = res;
          this.returnMoney = res.returnMoney;
          this.returnOriginal = res.applicationReturnMoney;
          if (this.tableData3.problemPhoto.length > 0) {
            this.picArray = this.tableData3.problemPhoto.split(",");
          }
          this.tableData2.push(res.merchantOrderDetail);
        },
        err => {}
      );
  },
  methods: {
    sure(val) {
      if (this.typeId == "") {
        this.$msgErr("请选择收货点");
        return;
      }
      if (this.returnMoney == "") {
        this.$msgErr("请输入退款金额");
        return;
      }
      if (this.returnMoney < 0) {
        this.$msgErr("退款金额必须大于0");
        return;
      }
      this.$http
        .post("/merchant_return_goods/update", {
          id: val,
          status: 2,
          returnSendId: this.typeId,
          returnMoney: this.returnMoney,
          resolveRemark: this.resolveRemark
        })
        .then(
          res => {
            this.$msgSuc("确定退货操作成功");
            window.history.go(-1);
          },
          err => {}
        );
    },
    cancel(val) {
      this.$http
        .post("/merchant_return_goods/update", {
          id: val,
          status: 3,
          resolveRemark: this.resolveRemark
        })
        .then(
          res => {
            this.$msgSuc("拒绝退货操作成功");
            window.history.go(-1);
          },
          err => {}
        );
    },
    search() {
      this.$http
        .post("/return_send/query_By_Id ", {
          id: this.typeId
        })
        .then(
          res => {
            this.returnAdress = res;
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
    },
    returnMoneychange() {
      this.returnMoney = this.num(this.returnMoney);
      if (this.returnMoney > this.returnOriginal) {
        this.returnMoney = this.returnOriginal;
      }
    },
    num(obj) {
      obj = obj.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      obj = obj.replace(/^\./g, ""); //验证第一个字符是数字
      obj = obj.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
      obj = obj
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      obj = obj.replace(/^[0][0-9]$/, "0." + Number(obj));
      return obj;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
em {
  font-style: normal;
}
.returnMoney .el-input {
  width: 199px !important;
  border: none;
}
.el-input .el-input__inner {
  height: 35px;
  line-height: 35px;
}
.body {
  width: 80%;
  min-width: 800px;
  margin: 0 auto;
  text-align: center;
  .box-title-second {
    margin-top: 30px;
  }
  .sure {
    background: rgba(26, 188, 156, 1);
  }
  .cancel {
    background: rgba(240, 72, 68, 1);
  }
  img {
    width: 100px;
    height: 100px;
  }
  table {
    margin-bottom: 30px;
    width: 100%;
    border-right: 1px solid #b4b4b4;
    border-bottom: 1px solid #b4b4b4;
    tr {
      height: 49px;
      font-size: 14px;
      background-color: #fff;
    }
    td {
      padding: 0 20px;
      text-align: left;
      border-left: 1px solid #b4b4b4;
      border-top: 1px solid #b4b4b4;
      color: #5a5a5a;
    }
    td:first-child {
      width: 100px;
    }
  }
}
</style>
