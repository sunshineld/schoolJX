<template>
    <el-pagination style="float: right;"
    background
    layout="total, prev, pager, next"
    :small="small"
    :total="total"
    :page-size="pageSize"
    :current-page.sync="currentPage"
    @current-change="currentChange">
    </el-pagination>
</template>

<script>
/*
通用分页组件
*/
export default {
    name: 'ITablePage',
    props: {
        value: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
            default: 0,
        },
        pageSize:{
            type:Number,
            default:10,
        },
        small: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            currentPage: this.value,
        }
    },
    watch: {
        value (newVal) {
            this.currentPage = newVal
        },
        currentPage (newVal) {
            this.$emit('input', newVal)
        }
    },
    mounted () {

    },
    methods: {
        currentChange(current) {
            this.$emit('change', current);
        }
    }
}
</script>

