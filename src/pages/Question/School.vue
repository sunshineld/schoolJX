<template>
    <SGT
    :title="title"
    :positionType="1"
    :oldPosition="2"></SGT>
</template>

<script>
import SGT from './SGT.vue'

export default {
    name: 'QuestionsSchool',
    data () {
        return {
            title: '学校题库'
        }
    },
    components: {
        SGT,
    },
}
</script>