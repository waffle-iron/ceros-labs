<template>
    <div class="container main-content" id="content">
        <div v-if="job" class="row">
            <div class=" col-md-12 ">

                <header class="job-header">
                    <h1 class="jobtitle meta-job-detail-title">{{ job.title }}</h1>
                    <p class="opening-info">
                        <span class="meta-job-location-city">{{ job.location_name }}</span>

                        <small v-if="job.badge_one" class="badge-opening-meta">{{ job.badge_one }}</small>
                        <small v-if="job.badge_two" class="badge-opening-meta">{{ job.badge_two }}</small>

                    </p>
                </header>

                <div class=" row ">
                    <div class=" col-md-9 ">
                        <div class="jobdesciption" v-html="job.content">

                        </div>



                        <section class="bottomspace-double">

                            <div id="div_apply_to_job" class="topspace-double">
                                <a href="#" v-on:click.prevent="displayApplicationForm" class="btn btn-primary btn-lg btn-apply hidden-print" style="">Apply for this opening</a>
                                <h4 class="visible-print"><strong>Apply for this opening at </strong><a class="hide-href" href="http://ceros.recruiterbox.com/jobs/fk06r4v?apply=true" title="DevOps Engineer at Ceros">
                                    http://ceros.recruiterbox.com/jobs/fk06r4v?apply=true</a>
                                </h4>


                                <div class="topspace-double hidden-xs">
                                    <router-link :to="{ name: 'job-board'}" class="btn-link">
                                        <i class="fa fa-angle-left"></i> Other openings at Ceros
                                    </router-link>
                                    <h4 class="visible-print"><strong>See all the jobs at Ceros here: </strong><a class="hide-href" href="http://ceros.recruiterbox.com/jobs" title="Jobs at Ceros">
                                        http://ceros.recruiterbox.com/jobs
                                    </a>
                                    </h4>
                                </div>


                            </div>

                            <div id="application_form_holder">
                                <div id="grnhse_app"></div>
                            </div>
                        </section>
                    </div>


                    <div class="col-md-3 hidden-print">


                        <div class="sidebar hidden-print">

                            <a v-on:click.prevent="displayApplicationForm" href="#" class="btn btn-primary btn-lg js-apply-for-job btn-block space-on-bottom-20px hidden-xs" style="">Apply for this opening</a>

                            <section class="card card-sm text-center">
                                <h5 class="card-title-text">share this opening with friends</h5>

                                <a v-on:click.prevent="shareLinkedIn" class="socicon-linkedin" target="_blank" href="#"><i class="fa fa-linkedin fa-fw"></i></a>

                                <a v-on:click.prevent="shareFacebook" class="socicon-facebook" target="_blank" href="#"><i class="fa fa-facebook fa-fw"></i></a>

                                <a v-on:click.prevent="shareTwitter" class="socicon-twitter" target="_blank" href="#"><i class="fa fa-twitter fa-fw"></i></a>

                                <a v-on:click.prevent="shareMailTo" class="socicon-mail" target="_blank" href="#"><i class="fa fa-envelope-o fa-fw"></i></a>

                            </section>

                        </div>



                        <div class="topspace-double visible-xs">

                            <router-link :to="{ name: 'job-board'}" class="btn-link">
                                <i class="fa fa-angle-left"></i> Other openings at Ceros
                            </router-link>

                            <h4 class="visible-print"><strong>See all the jobs at Ceros here: </strong><a class="hide-href" href="http://ceros.recruiterbox.com/jobs" title="Jobs at Ceros">
                                http://ceros.recruiterbox.com/jobs
                            </a>
                            </h4>
                        </div>


                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<style>

</style>

<script>

    import _ from 'lodash';
    import VueScrollTo from 'vue-scrollTo';

    import JobAPI from '../api/Job.js';

    export default {
        data() {
            return {
                wasError: false,
                job: null
            }
        },

        computed: {
          aOrAn() {
              const vowels = ['a', 'e', 'i', 'o', 'u'];
              const firstChar = this.job.title.charAt(0).toLocaleLowerCase();

              if (vowels.indexOf(firstChar) > -1) {
                  return "an";
              } else {
                  return "a";
              }
          }
        },

        methods: {
            loadData() {

                JobAPI.getJob(this.$route.params.id)
                    .catch(function(error) {
                        this.wasError = true;

                        this.$router.push({
                            name: '404'
                        })

                    }
                    .bind(this))
                    .done(function(job){

                        this.job = job;

                    }
                    .bind(this));

            },

            displayApplicationForm() {

                const applicationForm = Grnhse.Iframe.load(this.job.id);

                applicationForm.htmlElement.addEventListener('load', function () {
                    VueScrollTo.scrollTo(
                        "#grnhse_app",
                        500,
                        {
                            easing: VueScrollTo.easing['ease-in'],
                            offset: 20
                        }
                    );
                });
            },

            shareLinkedIn() {

                const url = "http://www.linkedin.com/shareArticle";

                this.openNewWindow(url, {
                    mini: true,
                    url: window.location.href,
                    title: this.job.title,
                    summary: "",
                    source: window.location.host
                });
            },

            shareFacebook() {
                const url = "//www.facebook.com/sharer/sharer.php";

                this.openNewWindow(url, {
                    u: window.location.href
                });
            },

            shareTwitter() {
                const url = "//twitter.com/intent/tweet";

                this.openNewWindow(url, {
                   text: "Ceros is hiring! " + window.location.href
                });
            },

            shareMailTo() {

                const url = "mailto:";

                const messageLines = [
                    "Hi,",
                    "Ceros is hiring " + this.aOrAn + " " + this.job.title + ".",
                    "Check out details here: " + window.location.href
                ];

                this.openNewWindow(url, {
                    subject: this.job.title,
                    body: messageLines.join("\n\n")
                });

            },

            openNewWindow(url, queryParams) {

                queryParams = queryParams || {};

                const queryString = _.reduce(queryParams, function (result, value, key) {

                    if (result != "") {
                        result += "&"
                    }

                    return result + encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }, "");

                window.open(url + "?" + queryString, "_blank");
            }
        },

        created() {
            this.loadData()
        },

        watch: {
            '$route' : 'loadData'
        }
    }

</script>