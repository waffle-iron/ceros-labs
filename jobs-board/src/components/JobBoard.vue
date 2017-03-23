<template>
    <div>
        <div class="company-header hidden-print js-company-header">
            <div class="container">
                <h1 class="company-header-title">
                    Ceros Jobs
                </h1>

                <a href="#" v-scroll-to="'#content'" class="js-show-openings btn btn-hollow btn-main">View Openings</a>
            </div>
        </div>
        <div class="container main-content" id="content">

            <div class="row">
                <div class=" col-md-12 ">

                    <h2 class="heading-section">Current Openings</h2>

                    <div class="row" v-for="row in rows">
                        <div class="col-md-6" v-for="job in row">

                            <div class="card card-clickable js-card" v-on:click="goToJob(job)">
                                <div class="row">
                                    <div class="col-xs-8 col-md-9">
                                        <router-link :to="{ name: 'job', params: { id: job.id }}" class="card-title">
                                            <h3 class="card-title-text cut-text">{{ job.title }}</h3>
                                        </router-link>
                                        <div class="card-info cut-text">
                                            <span class="meta-job-location-city cut-text">{{ job.location_name }}</span>
                                        </div>
                                    </div>
                                    <div class="card-badge col-xs-4 col-md-3">
                                        <small v-if="job.badge_one" class="badge-opening-meta">{{ job.badge_one }}</small>
                                        <small v-if="job.badge_two" class="badge-opening-meta">{{ job.badge_two }}</small>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

        </div>
    </div>
</template>

<style>
    .company-header {
        background-image: url("../assets/banner-bg.jpg");
    }
</style>

<script>

    import _ from 'lodash';
    import JobAPI from '../api/Job.js'

    export default {
        data() {
            return {
                jobs: []
            }
        },

        computed: {
            rows() {
                return _.chunk(this.jobs, 2);
            }
        },

        methods: {

            refreshData() {
                JobAPI.getJobListings().then(function(jobData){
                    this.jobs = jobData;
                }.bind(this));
            },

            goToJob(job) {
                this.$router.push({
                    name: 'job',
                    params: {
                        id: job.id
                    }
                });

            }

        },

        created() {
            this.refreshData();
        }
    }

</script>