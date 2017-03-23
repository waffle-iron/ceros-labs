<template>
    <div class="container">
        <h2>Ohps! We couldn't find what you're looking for</h2>
        <h3><a v-on:click.prevent="goHome" href="#">Go to back to the main page.</a></h3>
    </div>
</template>

<script>

    import _ from 'lodash';

    export default {
        data() {
            return {
                timer: null
            }
        },

        methods: {
            clearTimer() {
                if (this.timer != null) {
                    clearTimeout(this.timer);
                }
            },

            goHomeAuto() {
                this.clearTimer();
                this.timer = _.delay(function () {
                    this.goHome();
                }.bind(this), 1000 * 3);
            },

            goHome() {
                this.clearTimer();

                this.$router.push({
                    name: 'job-board'
                });
            }
        },

        created() {
            this.goHomeAuto();
        },

        watch: {
            '$route' : 'goHomeAuto'
        }
    }

</script>