<template>
  <div>
    <sub-title :subTitle="'商品评价'" :isRefresh="false"></sub-title>
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
          <span class="font-14 gray">输入搜索:</span>
          <el-input
            v-model="goodsName"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            placeholder="关键字/商品名称"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">用户昵称:</span>
          <el-input
            v-model="userName"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            placeholder="输入用户昵称"
            class="search-input"
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
        </div>
      </div>
      <el-table
        class="mall-table"
        :data="tableData"
        v-loading="loading"
        ref="table"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="100">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="用户昵称">
          <template slot-scope="scope">{{ scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column label="评价" width="140">
          <template slot-scope="scope">
            <img
              v-for="(star,index) in scope.row.commentLevel" :key="index"
              src="@/assets/starOn.png"
              class="icon-star"
            >
            <img
              v-for="(star,index) in scope.row.commentLevel1" :key="index"
              src="@/assets/starOff.png"
              class="icon-star"
            >
          </template>
        </el-table-column>
        <el-table-column label="IP地址" width="140">
          <template slot-scope="scope">{{ scope.row.commentIp }}</template>
        </el-table-column>
        <el-table-column label="评论时间" width="180">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatus($event, scope.row.id)"
              :active-value="0"
              :inactive-value="2"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push('/goods/comment/detail?id=' + scope.row.id)"
            >查看</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @handleChangeAll="handleChangeAll"
        :optionsList="optionsList"
        ref="pagination"
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
import pagination from "../../components/pagination";
import mixin from "../../Utils/mixin";
export default {
  name: "comment",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      tableData: [],
      total: 1,
      checkItemId: [],
      optionsList: {
        delete: "删除"
      },
      goodsName: "",
      userName: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .post("/merchantGoodsComment/merchant_goods_type_list_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          userName: this.userName
        })
        .then(res => {
          this.total = res.totalCount;
          for (var i = 0; i < res.list.length; i++) {
            res.list[i].commentLevel1 = 5 - res.list[i].commentLevel;
          }
          this.tableData = res.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("/merchantGoodsComment/delete_batch", id).then(res => {
          this.$msgSuc("删除成功");
          this.getList();
        });
      });
    },
    handleStatus($event, id) {
      this.$http
        .post("/merchantGoodsComment/delete_not_show", {
          id: id,
          status: $event
        })
        .then(
          res => {
            this.$msgSuc("操作成功");
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
  .search-input {
    width: 200px;
    margin: 0 15px;
  }
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
.icon-star {
  display: inline !important;
}
</style>