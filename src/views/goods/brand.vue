<template>
  <div>
    <sub-title :subTitle="'商品品牌'" :isRefresh="false"></sub-title>
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
            v-model="name"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            placeholder="品牌名称/关键字"
            class="search-input"
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/goods/brand/addBrand')">添加品牌</el-button>
        </div>
      </div>
      <el-table
        ref="table"
        class="mall-table"
        v-loading="loading"
        :data="tableData"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="品牌名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="品牌首字母">
          <template slot-scope="scope">{{ scope.row.firstChar }}</template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">{{ scope.row.sorting }}</template>
        </el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            <el-switch
              @change="handleShow($event, scope.row)"
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="相关">
          <template slot-scope="scope">
            <span>商品: {{ scope.row.goodsTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push('/goods/brand/addBrand?id=' + scope.row.id)"
            >编辑</span>
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
  name: "brand",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  mounted() {
    this.getList();
  },
  data() {
    return {
      tableData: [],
      name: "",
      isShow: true,
      checkItemId: [],
      optionsList: {
        delete: "删除",
        show: "显示品牌",
        hide: "隐藏品牌"
      }
    };
  },
  methods: {
    getList() {
      this.$http
        .post("merchant_goods_brand/query_for_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          name: this.name
        })
        .then(res => {
          this.tableData = res.list;
          this.total = res.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("merchant_goods_brand/delete_batch", id).then(
          () => {
            this.getList();
            this.$msgSuc("删除成功");
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
      });
    },
    batchShow(id, type) {
      this.$http
        .post("merchant_goods_brand/hidden_batch", {
          type: type,
          ids: id
        })
        .then(
          () => {
            this.getList();
            this.$msgSuc("操作成功");
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
    },
    handleShow($event, data) {
      let form = {
        id: data.id,
        name: data.name,
        logo: data.logo,
        areaLogo: data.areaLogo,
        story: data.story,
        isShow: $event,
        sorting: data.sorting,
        firstChar: data.firstChar
      };
      this.$http.post("merchant_goods_brand/update", form).then(
        () => {
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
</style>