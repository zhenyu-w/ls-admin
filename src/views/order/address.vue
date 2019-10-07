<template>
  <div>
    <sub-title :subTitle="'发货点信息管理'" :isRefresh="false"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('address/addAddress')">添加发货点</el-button>
        </div>
      </div>
      <el-table
        class="mall-table"
        v-loading="loading"
        ref="table"
        :data="tableData"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="发货点名称">
          <template slot-scope="scope">{{ scope.row.returnPname }}</template>
        </el-table-column>
        <!-- <el-table-column label="默认发货信息">
          <template slot-scope="scope">{{ scope.row.propertyNum }}</template>
        </el-table-column>
        <el-table-column label="默认退货信息">
          <template slot-scope="scope">{{ scope.row.paramNum }}</template>
        </el-table-column>-->
        <el-table-column label="发货人姓名">
          <template slot-scope="scope">{{ scope.row.returnName }}</template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">{{ scope.row.returnAddress }}</template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">{{ scope.row.returnPhone }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push('address/addAddress?id=' + scope.row.id)"
            >编辑</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination  @next="next" :total="total" :pageSize="pageSize"></pagination> -->
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
import pagination from "../../components/pagination";
import mixin from "../../Utils/mixin";
export default {
  name: "type",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      checkItemId: [],
      optionsList: {
        delete: "删除"
      },
      ruleForm: {
        styleName: ""
      },
      rules: {
        styleName: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http
        .post("/return_send/query_for_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        })
        .then(res => {
          this.total = res.totalCount;
          this.tableData = res.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    edit(data) {
      this.isAdd = false;
      this.dialogVisible = true;
      this.ruleForm.id = data.id;
      this.ruleForm.styleName = data.styleName;
    },
    addEdit(url) {
      this.$http.post(url, this.ruleForm).then(
        () => {
          this.$msgSuc("操作成功");
          this.getList();
          this.dialogVisible = false;
        },
        err => {
          this.$msgErr(err.msg);
        }
      );
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http
          .post("return_send/delete ", {
            ids: id
          })
          .then(
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
    tableSelection(val) {
      this.checkItemId = [];
      if (val.length == this.tableData.length) {
        this.$refs.pagination._data.checkAll = true;
      } else {
        this.$refs.pagination._data.checkAll = false;
      }
      console.log(val);
      val.forEach(item => {
        this.checkItemId.push(item.id);
      });
      // this.checkItemId = checkItemId.join(',');
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
.search-input {
  width: 200px;
  margin: 0 15px;
}
</style>