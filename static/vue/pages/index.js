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
            page: 1,
            offset: 0,
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
            this.chageSearch_Query();
        }
    },
    created() {
        var vm = this;
        $((function () {
            $(window).scroll((function () {
                $(window).scrollTop() + $(window).height() > $(document).height() - 300 && 0 == vm.load && vm.list.length >= 40 * vm.page && vm.changeoffset(vm.page + 1, !0)
            })), vm.getBeatmapData()
        }));
    },
    methods: {
        changeoffset: function (page = 1) {
            var vm = this;
            this.page = page;
            this.offset = 0;
            vm.getBeatmapData();
        },
        getBeatmapData: function () {
            var vm = this;
            this.load = true;
            this.$axios.get("https://nerina.wtf/api/search", {
                params: {
                    offset: this.offset,
                    mode: this.mode,
                    amount: 40 * this.page,
                    status: this.rank,
                    query: this.search_query
                }
            }).then(function (response) {
                vm.list = response.data;
                console.log(response.data);
                console.log(vm.search_query);
                vm.load = false;
            });
        },
        chnageMode(key, keyPath) {
            var vm = this;
            key = Number(key);
            vm.offset = 0;
            vm.page = 1;
            vm.mode = key;
        },
        chnageRankedStatus(key, keyPath) {
            var vm = this;
            key = Number(key);
            vm.offset = 0;
            vm.page = 1;
            vm.rank = key;
        },
        chageSearch_Query() {
            var vm = this;
            vm.offset = 0;
            vm.getBeatmapData();
        }
    }
});