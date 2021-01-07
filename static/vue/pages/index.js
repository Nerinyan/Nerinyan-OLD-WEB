Vue.use(window.VueTimeago);
Vue.config.devtools = true
new Vue({
    el: "#app",
    delimiters: ["<%", "%>"],
    data() {
        return {
            mode: '0',
            load: true,
            rank: '1',
            visible: false,
            list: [],
            page: 0,
            search_query: ''
        }
    },
    watch: {
        mode() {
            this.getBeatmapData();
        },
        rank() {
            this.getBeatmapData();
        },
        search_query() {
            this.getBeatmapData();
        }
    },
    created() {
        var vm = this;
        $(function () {
            vm.getBeatmapData();
        });
    },
    methods: {
        getBeatmapData: function () {
            var vm = this;
            this.load = true;
            this.$axios.get("https://nerina.wtf/api/search", {
                params: {
                    offset: 0,
                    mode: Number(this.mode),
                    amount: Number(this.page * 20),
                    status: Number(this.rank)
                }
            }).then(function (response) {
                vm.list = response.data;
                console.log(response.data);
                console.log(vm.search_query);
                vm.load = false;
            });
        },
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        }
    }
});