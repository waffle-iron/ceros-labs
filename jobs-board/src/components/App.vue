<template>
  <div>
    <div class="header-main">
      <div class="container">

        <div class="row row-flex">
          <div class="col-md-7 col-xs-8 header-main-logo-container">

            <router-link :to="{ name: 'job-board'}" class="header-main-logo hide-href">
              <img alt="Ceros logo" src="../assets/ceros-logo.png">
            </router-link>

          </div>

          <div class="col-md-5 col-xs-4 header-main-link-container">
            <a target="_blank" class="btn-link hidden-xs hide-href header-main-link" href="http://www.ceros.com/">
              www.ceros.com
            </a>
            <a target="_blank" class="btn-link visible-xs-inline tail10px header-main-link" href="http://www.ceros.com/">
              Website
              <i class="glyphicon glyphicon-share btn-link-external-icon"></i>
            </a>
          </div>

        </div>

      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>
