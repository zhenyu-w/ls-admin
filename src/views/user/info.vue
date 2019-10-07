<template>
  <div>
    <sub-title :subTitle="'用户信息'" :isBack="back"></sub-title>
    <div class="body" v-loading="loading">
      <div class="flex info">
        <div class="flex h-center">
          <img class="avatar" :src="getGoodImg(data.user.remark2)" alt="头像">
        </div>
        <div class="flex-1">
          <div class="flex">
            <div>用户ID</div>
            <div>{{ data.user.id }}</div>
          </div>
          <div class="flex">
            <div>昵称</div>
            <div>{{ data.user.realName }}</div>
          </div>
          <div class="flex">
            <div>性别</div>
            <div>{{ data.user.sex | getSex }}</div>
          </div>
          <div class="flex">
            <div>生日</div>
            <div>{{ data.user.birthday }}</div>
          </div>
          <div class="flex">
            <div>城市</div>
            <div>{{ data.user.remark5 }}</div>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex">
            <div>职业</div>
            <div>无</div>
          </div>
          <div class="flex">
            <div>个性签名</div>
            <div>无</div>
          </div>
          <div class="flex">
            <div>喜欢的分类</div>
            <div>无</div>
          </div>
          <div class="flex">
            <div>注册时间</div>
            <div>{{ data.user.createTime }}</div>
          </div>
          <div class="flex">
            <div>用户来源</div>
            <div>小程序</div>
          </div>
        </div>
      </div>
      <div class="statistics flex">
        <p class="title">统计信息</p>
        <div>
          <div>消费金额</div>
          <div>{{ data.consumption || 0 }}</div>
        </div>
        <div>
          <div>订单数量</div>
          <div>{{ data.order_count }}</div>
        </div>
        <div>
          <div>收藏商品</div>
          <div>{{ data.collection }}</div>
        </div>
        <div>
          <div>商品评价</div>
          <div>{{ data.evaluation }}</div>
        </div>
        <div>
          <div>退货记录</div>
          <div>{{ data.return_record }}</div>
        </div>
        <div>
          <div>登录次数</div>
          <div>{{ data.login_count }}</div>
        </div>
      </div>
      <p class="address-title">收货地址</p>
      <el-table
        class="mall-table"
        :data="data.addressList"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="姓名">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="手机号" width="140">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="详细地址">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="140">
          <template slot-scope="scope">{{ scope.row.postalCode }}</template>
        </el-table-column>
        <el-table-column label="默认地址" width="140">
          <template slot-scope="scope">
            <el-switch
              disabled
              v-model="scope.row.defaultState"
              :active-value="1"
              :inactive-value="2"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <p class="address-title" style="margin-top: 30px;">订单记录</p>
      <el-table
        class="mall-table"
        :data="list"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column label="订单编号">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="140">
          <template slot-scope="scope">{{ scope.row.creatTime }}</template>
        </el-table-column>
        <el-table-column label="用户账号">
          <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="140">
          <template slot-scope="scope">{{ scope.row.totalMoeny }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="140">
          <template slot-scope="scope">
            <span>微信</span>
          </template>
        </el-table-column>
        <el-table-column label="订单来源" width="140">
          <template slot-scope="scope">
            <span>小程序</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getOrderStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push('/order/list/orderDetail?id=' + scope.row.id)"
            >查看订单</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination @next="next" :isBatch="false" :total="total" :pageSize="pageSize"></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from "../../components/subTitile";
import pagination from "../../components/pagination";
import filters from "../../Utils/filters";
import mixin from "../../Utils/mixin";
export default {
  name: "userInfo",
  filters: filters,
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      data: {
        user: {}
      }
    };
  },
  mounted() {
    this.getDetail();
    this.getList();
  },
  methods: {
    getDetail() {
      this.$http.post("user_detail/query/" + this.$route.params.id).then(
        res => {
          this.data = res;
        },
        err => {
          this.$msgErr(err.msg);
        }
      );
    },
    getList() {
      this.loading = true;
      this.$http
        .post("merchant_order/query_for_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.getItem("userInfo")).merchantId,
          userId: this.$route.params.id
        })
        .then(
          res => {
            this.list = res.list;
            this.total = res.totalCount;
          },
          err => {
            this.$msgErr(err.msg);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 50px;
}
.info {
  border: $border;
  > div {
    border-right: $border;
    &:last-child {
      border-right: none;
    }
    > div {
      line-height: 36px;
      font-size: 14px;
      border-bottom: $border;
      > div {
        padding: 0 10px;
        &:first-child {
          width: 30%;
          color: $gray;
          background-color: #f6f6f6;
          border-right: $border;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
.statistics {
  margin: 30px 0;
  border: $border;
  .title {
    width: 100%;
    border-bottom: $border;
    line-height: 40px;
    font-weight: bold;
    padding-left: 20px;
    box-sizing: border-box;
    background-color: #efefef;
  }
  > div {
    flex: 1;
    border-right: $border;
    &:last-child {
      border-right: none;
    }
    > div {
      line-height: 49px;
      font-size: 15px;
      text-align: center;
      &:first-child {
        line-height: 49px;
        color: $gray;
        font-weight: 700;
        background-color: #f6f6f6;
        border-bottom: $border;
      }
    }
  }
}
.address-title {
  width: 100%;
  border: $border;
  border-bottom: none;
  line-height: 40px;
  font-weight: bold;
  padding-left: 20px;
  box-sizing: border-box;
  background-color: #efefef;
}
</style>