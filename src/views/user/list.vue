<template>
  <div>
    <sub-title :subTitle="'用户列表'" :isRefresh="false"></sub-title>
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
          <span class="font-14 gray">用户昵称:</span>
          <el-input
            v-model="realName"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            placeholder="请输入昵称"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">用户手机:</span>
          <el-input
            v-model="mobilePhone"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            placeholder="请输入手机号"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">注册时间:</span>
          <el-date-picker
            v-model="datePicker"
            @change="getList"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-left: 20px;"
            type="datetimerange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <!--<button class="mall-btn" @click="$router.push('/goods/brand/addBrand')">添加</button>
          <el-select v-model="input" placeholder="显示条数" class="search-input">
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
        v-loading="loading"
        :data="tableData"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="ID">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="微信头像">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.headImg)" alt>
          </template>
        </el-table-column>
        <el-table-column label="手机号/微信号">
          <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
        </el-table-column>
        <el-table-column label="微信昵称">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="openId">
          <template slot-scope="scope">
            <span>{{ scope.row.openId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="订单数量">
          <template slot-scope="scope"></template>
        </el-table-column>
        <el-table-column label="账户启用状态">
          <template slot-scope="scope">
            <el-switch @change="handleUserStatus($event, scope.row)" v-model="scope.row.userStatus" :active-value="1" :inactive-value="0" active-color="#5BC0BF" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push('/user/list/info/' + scope.row.id)">查看</span>
          </template>
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
  name: "user",
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
      realName: "",
      mobilePhone: "",
      datePicker: [],
      beginTime: "",
      endTime: ""
    };
  },
  methods: {
    getList() {
      if (this.datePicker && this.datePicker.length > 0) {
        this.beginTime = this.datePicker[0];
        this.endTime = this.datePicker[1];
      } else {
        this.datePicker = [];
        this.beginTime = "";
        this.endTime = "";
      }
      this.loading = true;
      this.$http
        .post("user_detail/list", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          mobilePhone: this.mobilePhone || null,
          realName: this.realName || null,
          beginTime: this.beginTime || null,
          endTime: this.endTime || null
        })
        .then(
          res => {
            this.tableData = res.list;
            this.total = res.totalCount;
          },
          err => {
            this.$msgErr(err.msg);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    handleUserStatus($event, data) {
      this.$http
        .post(
          "user/change_user_status",
          {
            userId: data.id,
            userStatus: $event
          },
          { type: "form" }
        )
        .then(
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
