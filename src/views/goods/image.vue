<template>
  <div>
    <sub-title :subTitle="'商品图片库'"></sub-title>
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
            placeholder="相册名称关键字"
            class="search-input"
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/goods/image/addImage')">添加相册</el-button>
          <!--<el-select v-model="input" placeholder="显示条数" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>
          <el-select v-model="input" placeholder="排序方式" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>-->
        </div>
      </div>
      <el-table
        ref="table"
        class="mall-table"
        :data="tableData"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="相册名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="封面">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.cover)" alt>
          </template>
        </el-table-column>
        <el-table-column label="图片数量">
          <template slot-scope="scope">{{ scope.row.imgTotal }}</template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">{{ scope.row.sorting }}</template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push('/goods/image/' + scope.row.id)">查看</span>
            <span
              class="table-btn"
              @click="$router.push('/goods/image/addImage?id=' + scope.row.id)"
            >编辑</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @confirmBatch="confirmBatch"
        @handleChangeAll="handleChangeAll"
        @next="next"
        :optionsList="optionsList"
        :total="total"
        :pageSize="pageSize"
        ref="pagination"
      ></pagination>
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
      name: "",
      tableData: [],
      optionsList: {
        delete: "删除"
      },
      checkItemId: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http
        .post("merchant_goods_galleries/query_for_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          name: this.name
        })
        .then(res => {
          this.total = res.totalCount;
          this.tableData = res.list;
        });
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("merchant_goods_galleries/delete_batch", id).then(
          () => {
            this.getList();
            this.$msgSuc("删除成功");
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
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