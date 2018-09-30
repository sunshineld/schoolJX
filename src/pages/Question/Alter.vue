<template>
    <Edit
    title="编辑试题"
    mode="w"
    :echo="echo"
    :data="data"></Edit>
</template>

<script>
import Edit from './Edit'

export default {
    data () {
        return {
            data: {},
            id: this.$route.params.id,
            type: this.$route.params.type,
            echo: false,
        }
    },
    mounted () {
        this.req()
    },
    methods: {
        req () {
            this.$http.post('/Question/getDetailById', {
                token: this.$tools.getToken(),
                uid: this.$tools.getUID(),
                school_id: this.$tools.getSchoolID(),
                id: this.id,
                question_type: this.type,
            })
            .then(res => {
                this.echo = true
                this.$nextTick(() => {
                    // 重置不要的值
                    if (!parseInt(res.data.level_2_knowledge_id)) {
                        res.data.level_2_knowledge_id = null
                    }
                    if (!parseInt(res.data.level_3_knowledge_id)) {
                        res.data.level_3_knowledge_id = null
                    }
                    if (!parseInt(res.data.unitid)) {
                        res.data.unitid = null
                    }
                    this.data = res.data
                })
            })
        }
    },
    components: {
        Edit,
    },
}
</script>