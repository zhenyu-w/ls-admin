<template>
  <div>
    <sub-title :subTitle="'订单管理'" :isRefresh="false"></sub-title>
    <div class="body">
      <div class="filter-wrap">
        <div class="flex h-center between">
          <div>
            <span class="font-14 gray">
              <i class="el-icon-search"></i>
              筛选查询
            </span>
          </div>
          <div class="search-wrap">
            <span class="font-14 gray" @click="showSearch" v-show="!visibleSearch">
              <i class="el-icon-arrow-down"></i>
              打开筛选
            </span>
            <span class="font-14 gray" @click="showSearch" v-show="visibleSearch">
              <i class="el-icon-arrow-up"></i>
              收起筛选
            </span>
            <el-button class="search" @click="back" v-if="groupManageId">返回</el-button>
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">商品名称:</span>
          <el-input
            v-model="goodName"
            @clear="search"
            @keyup.enter.native="search"
            clearable
            placeholder="请输入商品名称"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">订单编号:</span>
          <el-input
            v-model="code"
            @clear="search"
            @keyup.enter.native="search"
            clearable
            placeholder="请输入订单编号"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">订单状态:</span>
          <el-select
            v-model="status"
            @change="search"
            placeholder="请选择订单状态"
            clearable
            class="search-input"
          >
            <el-option :label="item" :value="index" v-for="(item,index) in promotionOrderStatus" :key="index"></el-option>
          </el-select>
          <span class="font-14 gray">拼团状态:</span>
          <el-select
            v-model="groupStatus"
            @change="search"
            placeholder="请选择拼团状态"
            clearable
            class="search-input"
          >
            <el-option :label="item" :value="index" v-for="(item,index) in promotionStatus" :key="index"></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
      </div>
      <el-table
        class="mall-table"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="订单编号">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="拼团编号">
          <template slot-scope="scope">{{ scope.row.groupManageId }}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">{{ scope.row.details[0].goodsName }}</template>
        </el-table-column>
        <el-table-column label="拼团状态">
          <template slot-scope="scope">{{ scope.row.groupStatus | getPromotionStatus }}</template>
        </el-table-column>
        <el-table-column label="订单金额">
          <template slot-scope="scope">{{ scope.row.totalMoeny }}</template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">{{ scope.row.status | getPromotionOrderStatus }}</template>
        </el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
        </el-table-column>
        <el-table-column label="收货人">
          <template slot-scope="scope">{{ scope.row.receiver }}</template>
        </el-table-column>
        <el-table-column label="收货人手机">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="收货地址">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">{{ '微信支付' }}</template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{ scope.row.creatTime }}</template>
        </el-table-column>
        <el-table-column label="已取消退款状态">
          <template slot-scope="scope">{{ scope.row.returnStatus == 0 ? '未退款' : '已退款' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              v-if="scope.row.status == 2"
              @click="ruleForm.id = scope.row.id; dialogVisible = true"
            >发货</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :isBatch="false"
        @next="next"
        :total="total"
        :pageSize="pageSize"
        ref="pagination"
      ></pagination>
      <el-dialog title="拼团发货" :visible.sync="dialogVisible" :append-to-body="true">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="快递公司" prop="sendCompany">
            <el-input v-model="ruleForm.sendCompany"></el-input>
          </el-form-item>
          <el-form-item label="快递单号" prop="sendCode">
            <el-input v-model="ruleForm.sendCode"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendGoods">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from "../../components/subTitile";
import pagination from "../../components/pagination";
import mixin from "../../Utils/mixin";
import filters from "../../Utils/filters";
export default {
  name: "groupOrder",
  mixins: [mixin],
  filters: filters,
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      dialogVisible: false,
      goodName: "",
      code: "",
      groupStatus: "",
      status: "",
      groupManageId: "",
      tableData: [],
      promotionOrderStatus: filters.promotionOrderStatus,
      promotionStatus: filters.promotionStatus,
      ruleForm: {
        sendCompany: "",
        sendCode: ""
      },
      rules: {
        sendCompany: [
          { required: true, message: "请输入快递公司", trigger: "blur" }
        ],
        sendCode: [
          { required: true, message: "请输入快递单号", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.groupManageId = this.$route.query.id;
    }
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .post("merchant_order/groupOrderList", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodName: this.goodName || null,
          code: this.code || null,
          groupStatus: this.groupStatus || null,
          status: this.status || null,
          groupManageId: this.groupManageId || null,
          merchantId: JSON.parse(localStorage.getItem("userInfo")).merchantId
        })
        .then(res => {
          this.tableData = res.list;
          this.total = res.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    sendGoods(id) {
      let ruleForm = Object.assign(
        {
          merchantId: JSON.parse(localStorage.getItem("userInfo")).merchantId,
          status: 3
        },
        this.ruleForm
      );
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$http.post("merchant_order/update", ruleForm).then(
            () => {
              this.$msgSuc("发货成功");
              this.dialogVisible = false;
              this.ruleForm = {
                sendCompany: "",
                sendCode: ""
              };
            },
            err => {
              this.$msgErr(err.msg);
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.filter-wrap {
  border: $border;
  margin-bottom: 24px;
  > div {
    padding: 0 22px;
    height: 56px;
    &:last-child {
      background-color: $bgColor;
    }
  }
  .search {
    margin-left: 20px;
    margin-right: 0;
  }
}
.search-input {
  width: 200px;
  margin: 0 15px;
}
.box-title {
  padding-right: 20px;
  .search-input {
    width: 150px;
    margin-left: 20px;
  }
  .mall-btn:last-child {
    margin-right: 0;
  }
}
</style>
