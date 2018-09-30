<template>
    <SGT
    :title="title"
    :positionType="2"
    :oldPosition="3"></SGT>
</template>

<script>
import SGT from './SGT.vue'

export default {
    data () {
        return {
            title: '年级题库'
        }
    },
    components: {
        SGT,
    },
}
</script>