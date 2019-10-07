<template>
  <div>
    <sub-title :subTitle="'退货申请'" :isRefresh="false"></sub-title>
    <div class="body">
      <div>
        <button class="mall-btn" :class="isactive == 'all'?'active':''" @click="onSubmit('all')">
          全部申请 (
          <em class="grid-content bg-purple">{{all}})</em>
        </button>
        <button class="mall-btn" :class="isactive == '1'?'active':''" @click="onSubmit(1)">
          待处理 (
          <em class="grid-content bg-purple">{{all_wei}}</em>)
        </button>
        <button class="mall-btn" :class="isactive == '2'?'active':''" @click="onSubmit(2)">
          退货中 (
          <em class="grid-content bg-purple">{{all_return}}</em>)
        </button>
        <button class="mall-btn" :class="isactive == '6'?'active':''" @click="onSubmit(6)">
          已完成 (
          <em class="grid-content bg-purple">{{all_complate}}</em>)
        </button>
        <button class="mall-btn" :class="isactive == '3'?'active':''" @click="onSubmit(3)">
          已拒绝 (
          <em class="grid-content bg-purple">{{all_refuse}}</em>)
        </button>
      </div>
      <div class="filter-wrap">
        <div class="flex h-center between">
          <div>
            <img src="@/assets/order/search.png">
            <span class="font-14 gray">筛选查询</span>
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
            <el-button class="search" @click="search()">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">输入搜索:</span>
          <el-input
            v-model="searchcode"
            placeholder="订单编号"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            class="search-input"
          ></el-input>
          <span class="font-14 gray">收货人:</span>
          <!-- /手机号码 -->
          <el-input
            v-model="receiver"
            placeholder="收货人姓名"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            class="search-input"
          ></el-input>
          <span class="font-14 gray">提交时间:</span>
          <el-date-picker
            v-model="value1"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd hh:mm:ss"
            class="search-input"
            :picker-options="pickerOptions1"
            @change="search()"
          ></el-date-picker>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">订单列表</span>
        <div class="flex h-center">
          <el-button @click="exportExcel()">导出订单</el-button>
          <!-- <el-select v-model="input" placeholder="显示条数" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>
          <el-select v-model="input" placeholder="排序方式" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>-->
        </div>
      </div>
      <el-table
        v-loading="loading"
        id="aaa"
        class="mall-table"
        :data="tableData3"
        ref="table"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55" :selectable="checkboxT" disabled="true"></el-table-column>
        <el-table-column label="服务单号">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="申请时间">
          <template slot-scope="scope">{{ scope.row.creatTime }}</template>
        </el-table-column>
        <el-table-column label="用户账号">
          <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
        </el-table-column>
        <el-table-column label="退款金额">
          <template slot-scope="scope">{{ scope.row.applicationReturnMoney }}</template>
        </el-table-column>
        <!-- <el-table-column label="联系人" width="130">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>-->
        <el-table-column label="申请状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">待处理</span>
            <span v-else-if="scope.row.status == 2">同意退货</span>
            <span v-else-if="scope.row.status == 3">拒绝退货</span>
            <span v-else-if="scope.row.status == 4">收到货确认退款</span>
            <span v-else-if="scope.row.status == 5">收到货拒绝退款</span>
            <span v-else>完成</span>
          </template>

          <!-- <template slot-scope="scope" v-else-if="scope.row.status == 2">同意退货</template>
          <template slot-scope="scope" v-else>同意退款</template>-->
        </el-table-column>
        <!-- <el-table-column label="处理时间">
          <template slot-scope="scope">{{ scope.row.updateTime }}</template>
        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              v-if="scope.row.status == 1"
              @click="$router.push('/order/returnGoods/returnGoodsDetail?id=' + scope.row.id)"
            >查看详情</span>
            <span
              class="table-btn"
              v-else-if="scope.row.status == 3"
              @click="remove([scope.row.id])"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        @handleChangeAll="handleChangeAll"
        :optionsList="optionsList"
        @confirmBatch="confirmBatch"
        @next="next"
        :total="total"
        :pageSize="pageSize"
      ></pagination>
    </div>
  </div>
</template>
<script>
import subTitle from "../../components/subTitile";
import mixin from "../../Utils/mixin";
import pagination from "../../components/pagination";
import FileSaver from "file-saver";
import XLSX from "xlsx";

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
      tableData3: [],
      total: 1,
      all: "",
      all_wei: "",
      all_return: "",
      all_complate: "",
      all_refuse: "",
      isactive: "all",
      checkItemId: [],
      status: "",
      optionsList: {
        delete: "删除"
      },
      receiver: null,
      searchcode: null,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: ""
    };
  },
  created: function() {
    ///merchant_return_goods/getCountByStatus
    this.onlond();
    this.getList(1, "");
  },
  methods: {
    getList(pageSize11, status) {
      //merchant_order/query_for_page
      this.loading = true;
      this.status = status;
      var _this = this;
      if (this.searchcode == "") {
        this.searchcode = null;
      }
      if (this.receiver == "") {
        this.receiver = null;
      }
      this.$http
        .post("/merchant_return_goods/query_for_page", {
          currentPage: pageSize11,
          pageSize: this.pageSize,
          contact: this.receiver,
          code: this.searchcode,
          creatTime: this.value1,
          status: status,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(
          res => {
            this.total = res.totalCount;
            this.tableData3 = res.list;
          },
          err => {
            this.$msgErr(err.msg);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    search() {
      this.getList(1, this.status);
    },
    next(val) {
      this.getList(val);
    },
    onSubmit(val) {
      this.isactive = val;
      if (val == "all") {
        val = "";
      }
      this.getList(1, val);
    },
    exportExcel() {
      let date = new Date().getTime();
      //let o =
      var wb = XLSX.utils.table_to_book(document.querySelector("#aaa"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          date + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    checkboxT(row, index) {
      if (row.status == 3) {
        return 1;
      } else {
        return 0;
      }
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("/merchant_return_goods/delete", { ids: id }).then(
          () => {
            this.$msgSuc("删除成功");
            this.getList(1, this.status);
            this.onlond();
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
      });
    },
    tableSelection(val) {
      this.checkItemId = [];
      if (val.length == this.tableData3.length) {
        this.$refs.pagination._data.checkAll = true;
      } else {
        this.$refs.pagination._data.checkAll = false;
      }
      val.forEach(item => {
        this.checkItemId.push(item.id);
      });
    },
    onlond() {
      this.$http
        .post("/merchant_return_goods/getCountByStatus", {
          status: "",
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.all = res;
        });
      this.$http
        .post("/merchant_return_goods/getCountByStatus", {
          status: 1,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.all_wei = res;
        });
      this.$http
        .post("/merchant_return_goods/getCountByStatus", {
          status: 2,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.all_return = res;
        });
      this.$http
        .post("/merchant_return_goods/getCountByStatus", {
          status: 6,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.all_complate = res;
        });
      this.$http
        .post("/merchant_return_goods/getCountByStatus", {
          status: 3,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.all_refuse = res;
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.mall-btn.active em {
  color: #fff;
}
em {
  font-style: normal;
  color: red;
}
em {
  margin: 0 2px;
}
.filter-wrap {
  border: $border;
  margin-bottom: 24px;
  margin-top: 30px;
  em {
    font-style: normal;
  }
  img {
    width: 20px;
    margin-bottom: -6px;
  }
  > div {
    padding: 0 22px;
    height: 56px;
    &:last-child {
      background-color: $bgColor;
    }
  }
  .search-input {
    width: 200px;
    margin: 0 15px;
  }
}
.mall-btn {
  height: auto;
  font-size: 14px;
  padding: 0 18px;
}
.search {
  margin-left: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
