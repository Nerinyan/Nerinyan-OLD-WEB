<template>
    <Navbar></Navbar>
    <router-view/>
</template>

<script>
import Navbar from './components/Navbar'
export default {
    name: 'App',
    components: {
        'Navbar': Navbar,
    },
}
</script>

<style lang="scss">
@font-face {
    font-family: 'TmoneyRoundWindRegular';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindRegular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: FontAwesomeExtra;
    src: url('./assets/fonts/extra.6f1f24ae.ttf') format("truetype");
    font-weight: normal;
    font-size: normal;
}

#app {
    font-family: 'TmoneyRoundWindRegular';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>


