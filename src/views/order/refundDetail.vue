<template>
  <div>
    <sub-title :subTitle="'服务单详情'" :isRefresh="false"></sub-title>
    <div class="body">
      <table class="table-middle" border="1">
        <tbody>
          <tr>
            <td>服务单号</td>
            <td>{{tableData3.code}}</td>
          </tr>
          <tr>
            <td>申请状态</td>
            <td>否</td>
          </tr>
          <tr>
            <td>订单编号</td>
            <td>{{tableData3.orderCode}}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>{{tableData3.resloveTime}}</td>
          </tr>
          <tr>
            <td>用户账号</td>
            <td>{{tableData3.mobilePhone}}</td>
          </tr>
        </tbody>
      </table>
      <table class="table-middle" border="1">
        <tbody>
          <tr>
            <td>订单金额</td>
            <td>{{tableData3.returnMoney}}</td>
          </tr>
          <tr>
            <td>确认退款金额</td>
            <td>{{tableData3.returnMoney}}</td>
          </tr>
          <tr>
            <td>退款方式</td>
            <td>退回到原支付渠道</td>
          </tr>
          <tr>
            <td>退款类型</td>
            <td>{{tableData3.returnReason}}</td>
          </tr>
          <!-- <tr>
                      <td>用户账号</td>
                      <td>{{tableData3.mobelPhone}}</td>
          </tr>-->
        </tbody>
      </table>
      <table>
        <tr>
          <td>处理备注</td>
          <!-- <td><input type="text"  v-model="resolveRemark" /></td> -->
          <td>
            <span class="returnMoney">
              <el-input v-model="resolveRemark"></el-input>
            </span>
          </td>
        </tr>
      </table>
      <el-button type="primary" class="sure" @click="sure(tableData3.id)">确定退款</el-button>
      <el-button type="primary" class="cancel" @click="cancel(tableData3.id)">拒绝退款</el-button>
    </div>
  </div>
</template>
<script>
import subTitle from "../../components/subTitile";
export default {
  name: "accountSetting",
  components: {
    subTitle
  },
  data() {
    return {
      tableData3: [],
      resolveRemark: ""
    };
  },
  created: function() {
    this.$http
      .post("/merchant_return_goods/query_By_Id", {
        id: this.$route.query.id,
        merchantId: JSON.parse(localStorage.userInfo).merchantId
      })
      .then(
        res => {
          this.tableData3 = res;
        },
        err => {}
      );
  },
  methods: {
    sure(val) {
      this.$http
        .post("/merchant/return_money", {
          id: val,
          merchantId: JSON.parse(localStorage.userInfo).merchantId,
          resolveRemark: this.resolveRemark
        })
        .then(
          res => {
            this.$msgSuc("确定退钱操作成功");
            window.history.go(-1);
          },
          err => {}
        );
    },
    cancel(val) {
      this.$http
        .post("/merchant_return_goods/update", {
          id: val,
          status: 5,
          resolveRemark: this.resolveRemark
        })
        .then(
          res => {
            this.$msgSuc("拒绝退钱操作成功");
            window.history.go(-1);
          },
          err => {}
        );
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.body {
  width: 80%;
  min-width: 800px;
  margin: 0 auto;
  text-align: center;
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
      height: 40px;
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
