<template>
  <div>
    <sub-title :subTitle="'拼团商品列表'"></sub-title>
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
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">商品名称:</span>
          <el-input
            v-model="goodsName"
            @clear="search"
            @keyup.enter.native="search"
            clearable
            placeholder="请输入商品名称"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">商品状态:</span>
          <el-select
            v-model="status"
            @change="search"
            placeholder="请选择商品状态"
            clearable
            class="search-input"
          >
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/promotion/addGoods')">添加拼团商品</el-button>
        </div>
      </div>
      <el-table
        class="mall-table"
        v-loading="loading"
        :data="tableData"
        ref="table"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="编号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column label="团个数">
          <template slot-scope="scope">{{ scope.row.groupMaxNum }}</template>
        </el-table-column>
        <el-table-column label="团规格">
          <template slot-scope="scope">{{ `${scope.row.groupUserNum}人-${scope.row.groupPrice}元` }}</template>
        </el-table-column>
        <el-table-column label="原价/元">
          <template slot-scope="scope">{{ scope.row.merchantGoodsTypeProperty.goodsSalePrice }}</template>
        </el-table-column>
        <el-table-column label="已开团">
          <template slot-scope="scope">{{ scope.row.openGroup }}</template>
        </el-table-column>
        <el-table-column label="已成团">
          <template slot-scope="scope">{{ scope.row.endGroup }}</template>
        </el-table-column>
        <el-table-column label="参团人数">
          <template slot-scope="scope">{{ scope.row.groupUserNum }}</template>
        </el-table-column>
        <el-table-column label="是否上架">
          <template slot-scope="scope">
            <el-switch
              @change="handleShow($event, scope.row.id)"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-color="#5BC0BF"
              inactive-color="#dedede"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="上架时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push('/promotion/addGoods?id=' + scope.row.id)"
            >编辑</span>
            <span class="table-btn" @click="showLog(scope.row.id)">日记</span>
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
      <el-dialog title="提示" :append-to-body="true" :visible.sync="dialogVisible">
        <el-table class="promotion-table" :data="dialogData" style="width: 100%">
          <el-table-column prop="createTime" label="操作时间"></el-table-column>
          <el-table-column prop="content" label="操作内容"></el-table-column>
          <el-table-column prop="merchantName" label="操作者"></el-table-column>
        </el-table>
        <div class="dialog-pagination-wrap">
          <el-pagination
            @current-change="dialoghandleCurrentChange"
            :current-page.sync="dialogCurrentPage"
            :total="dialogTotal"
            :page-size="dialogPageSize"
            background
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from "../../components/subTitile";
import pagination from "../../components/pagination";
import mixin from "../../Utils/mixin";
export default {
  name: "list",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      goodsName: "",
      status: "",
      tableData: [],
      dialogData: [],
      dialogVisible: false,
      dialogCurrentPage: 1,
      dialogPageSize: 10,
      dialogTotal: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .post("merchantGoodsGroup/goods_group_list_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          status: this.status
        })
        .then(
          res => {
            this.total = res.totalCount;
            this.tableData = res.list;
          },
          err => {
            this.$msgErr(err.msg);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    showLog(id) {
      this.dialogVisible = true;
      this.groupId = id;
      this.$http
        .post("merchantGoodsGroup/query_log_pages", {
          currentPage: this.dialogCurrentPage,
          pageSize: this.dialogPageSize,
          groupId: id
        })
        .then(
          res => {
            this.dialogData = res.list;
            this.dialogTotal = res.totalCount;
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
    },
    dialoghandleCurrentChange(val) {
      this.dialogCurrentPage = val;
      this.showLog(this.groupId);
    },
    handleShow($event, id) {
      this.$http
        .post("merchantGoodsGroup/group_oprate", {
          id: id,
          status: $event
        })
        .then(
          () => {
            this.$msgSuc("操作成功");
            this.getList();
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
  .mall-btn {
    margin-right: 0;
  }
}
.dialog-pagination-wrap {
  margin-top: 20px;
  text-align: right;
}
.promotion-table {
  /deep/ .el-table__empty-block {
    border: none;
  }
}
</style>