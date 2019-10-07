<template>
  <div>
    <sub-title :subTitle="'退货原因'" :isRefresh="false"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button class="search" @click="update('')">添加原因</el-button>
          <!-- <el-select v-model="input" placeholder="显示条数" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>
          <el-select v-model="input" placeholder="排序方式" class="search-input">
            <el-option key="1" value="1" label="1"></el-option>
          </el-select>-->
        </div>
      </div>
      <el-table
        class="mall-table"
        :data="tableData3"
        v-loading="loading"
        ref="table"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="原因类型">
          <template slot-scope="scope">{{ scope.row.reasonType }}</template>
        </el-table-column>
        <el-table-column prop="name" label="排序">
          <template slot-scope="scope">{{scope.row.sorts}}</template>
        </el-table-column>
        <el-table-column prop="address" label="是否启用" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              @change="handleStatus($event, scope.row.id)"
              v-model="scope.row.isUse"
              :active-value="1"
              :inactive-value="0"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="添加时间" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatTime}}</template>
        </el-table-column>
        <el-table-column prop="address" label="编辑" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="table-btn" @click="update(scope.row.id)">编辑</span>
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
      <el-dialog title="退货原因" :visible.sync="dialogVisible" :append-to-body="true">
        <el-form>
          <el-form-item label="原因类型">
            <el-input v-model="reason"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="sorts" type="number" @keyup.native="number"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch
              v-model="isUse"
              :active-value="1"
              :inactive-value="0"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import subTitle from "../../components/subTitile";
import mixin from "../../Utils/mixin";
import pagination from "../../components/pagination";

export default {
  name: "returnCause",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      input: "",
      tableData3: [],
      total: 1,
      checkAll: true,
      dialogVisible: false,
      isUse: 1,
      checkItemId: [],
      pagesize2: 1,
      id: "",
      sorts: "",
      reason: "",
      optionsList: {
        delete: "删除"
      }
      //   pickerOptions1: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now();
      //   },
      //   shortcuts: [{
      //     text: '今天',
      //     onClick(picker) {
      //       picker.$emit('pick', new Date());
      //     }
      //   }, {
      //     text: '昨天',
      //     onClick(picker) {
      //       const date = new Date();
      //       date.setTime(date.getTime() - 3600 * 1000 * 24);
      //       picker.$emit('pick', date);
      //     }
      //   }, {
      //     text: '一周前',
      //     onClick(picker) {
      //       const date = new Date();
      //       date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      //       picker.$emit('pick', date);
      //     }
      //   }]
      // },
      // value1: '',
    };
  },
  created: function() {
    this.getList(1);
  },
  methods: {
    getList(pageSize11) {
      this.loading = true;
      this.pagesize2 = pageSize11;
      this.$http
        .post("/return_reason/query_for_pageB", {
          currentPage: pageSize11,
          pageSize: this.pageSize,
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
    handleStatus($event, id) {
      this.$http
        .post("/return_reason/add", {
          id: id,
          isUse: $event,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(
          res => {
            this.$msgSuc("操作成功");
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("/return_reason/delete", { ids: id }).then(
          () => {
            this.$msgSuc("删除成功");
            this.getList(1);
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
      });
    },
    update(val) {
      this.id = val;
      if (val == "") {
        (this.sorts = ""), (this.reason = ""), (this.isUse = "");
      } else {
        this.$http
          .post("/return_reason/selectOne", {
            id: val,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(
            res => {
              this.sorts = res.sorts;
              this.reason = res.reasonType;
              this.isUse = res.isUse;
            },
            err => {
              this.$msgErr(err.msg);
            }
          );
      }
      this.dialogVisible = true;
    },
    number() {
      this.sorts = this.sorts.replace(/[^\.\d]/g, "");
      this.sorts = this.sorts.replace(".", "");
    },
    add() {
      if (this.reason == "") {
        this.$msgErr("请输入退货原因");
        return false;
      }
      if (this.sorts == "") {
        this.$msgErr("请输入排序");
        return false;
      }
      if (this.id == "") {
        this.$http
          .post("/return_reason/add", {
            reasonType: this.reason,
            sorts: this.sorts,
            isUse: this.isUse,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(
            res => {
              this.$msgSuc("添加成功");
              this.dialogVisible = false;
              this.getList(this.pageSize2);
            },
            err => {
              this.$msgErr(err.msg);
            }
          );
      } else {
        this.$http
          .post("/return_reason/add", {
            reasonType: this.reason,
            sorts: this.sorts,
            id: this.id,
            isUse: this.isUse,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(
            res => {
              this.$msgSuc("修改成功");
              this.getList(this.pageSize2);
              this.dialogVisible = false;
            },
            err => {
              this.$msgErr(err.msg);
            }
          );
      }
    },
    next(val) {
      this.getList(val);
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
    // open3() {
    //   this.$prompt('请输入邮箱', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //     inputErrorMessage: '邮箱格式不正确'
    //   }).then(({ value }) => {
    //     this.$message({
    //       type: 'success',
    //       message: '你的邮箱是: ' + value
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消输入'
    //     });
    //   });
    // }
    headerStyle() {
      return {
        color: "#595757",
        background: "#F6F6F6",
        fontSize: "15px",
        borderLeft: "1px solid #b4b4b4",
        borderTop: "1px solid #b4b4b4",
        textAlign: "center"
      };
    },
    tdStyle() {
      return {
        color: "#595757",
        fontSize: "15px",
        borderLeft: "1px solid #b4b4b4",
        borderTop: "1px solid #b4b4b4",
        textAlign: "center"
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.filter-wrap {
  border: 1px solid #dedede;
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

.search {
  margin-left: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}

/deep/ {
  .el-dialog {
    width: 500px;
  }
  .el-form-item__label {
    display: inline-block;
    width: 100px;
  }
}
</style>
