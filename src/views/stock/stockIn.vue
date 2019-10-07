<template>
  <div>
    <sub-title :subTitle="'商品入库'"></sub-title>
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
            placeholder="商品名称/商品货号"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">操作类型:</span>
          <el-select
            v-model="operateType"
            @change="search"
            clearable
            placeholder="请选择操作类型"
            class="search-input"
          >
            <el-option :value="item.code" :label="item.name" v-for="(item, index) in stockTypeList" :key="index"></el-option>
          </el-select>
          <span class="font-14 gray">操作时间：</span>
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            @change="handleDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <!--<div class="flex h-center">
          <el-select v-model="input" placeholder="显示条数" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>
          <el-select v-model="input" placeholder="排序方式" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>
        </div>-->
      </div>
      <el-table
        ref="table"
        class="mall-table"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="编号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.goodsImg)" alt>
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <p>{{ scope.row.goodsName }}</p>
            <p>品牌: {{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="货号/属性">
          <template slot-scope="scope">{{ scope.row.goodsNo }}/{{ scope.row.property }}</template>
        </el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">{{ scope.row.orderCode }}</template>
        </el-table-column>
        <el-table-column label="库存">
          <template slot-scope="scope">
            <p>数量: {{ scope.row.changeNumber }}</p>
            <p>剩余: {{ scope.row.changeAfter }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作类型">
          <template slot-scope="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column label="操作信息">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
      </el-table>
      <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize"></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from "../../components/subTitile";
import pagination from "../../components/pagination";
import mixin from "../../Utils/mixin";
export default {
  name: "stockIn",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      name: "",
      beginTime: "",
      endTime: "",
      operateType: "",
      tableData: [],
      datePicker: []
    };
  },
  mounted() {
    this.getStockType(1);
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .post("merchant_goods_log/query_for_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          search: this.name,
          operateType: this.operateType,
          beginTime: this.beginTime,
          endTime: this.endTime,
          type: 1
        })
        .then(res => {
          this.tableData = res.list;
          this.total = res.totalCount;
        })
        .finally(() => {
          this.loading = false;
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