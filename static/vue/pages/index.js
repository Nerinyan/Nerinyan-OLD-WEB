Vue.use(window.VueTimeago);
Vue.config.devtools = true
new Vue({
    el: "#app",
    delimiters: ["<%", "%>"],
    data() {
        return {
            first_load: true,
            advenced: false,
            mode: m,
            load: true,
            rank: s,
            visible: false,
            list: [],
            page: 1,
            offset: 0,
            search_query: q,
            creatorid: creator,
            delay: null,
            activeSearchDetails: ['0'],
            form: {
                title: '',
                artist: '',
                creator: '',
                ar: [0, 100],
                cs: [0, 50],
                od: [0, 80],
                hp: [0, 100],
                bpm: [160, 360],
                length: [0, 360],
                sort: 'set_last_updated',
                sort2: 'Descending'
            }
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
            var vm = this;
            clearTimeout(this.delay);
            this.delay = setTimeout(function() {
                vm.chageSearch_Query();
            }, 500);
            vm.advenced = false;
        },
        creatorid() {
            this.getBeatmapDataByCreatorId();
        },
        form() {
            console.log("name" + this.form.name);
        }
    },
    created() {
        var vm = this;
        $((function () {
            $(window).scroll((function () {
                $(window).scrollTop() + $(window).height() > (($(document).height() - 300) * 0.05) && 0 == vm.load && vm.list.length >= 48 * vm.page && vm.changeoffset(vm.page + 1, !0)
            })), vm.getBeatmapData()
        }));
    },
    methods: {
        formatadvenceSearch(val) {
            return val / 10;
        },
        formlength(val) {
            var hrs = ~~(val / 3600);
            var mins = ~~((val % 3600) / 60);
            var secs = ~~val % 60;
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        },
        makeAdvencedQuery() {
            var vm = this;
            var new_query = '';
            if (vm.form.cs[0] == vm.form.cs[1]) {
                new_query += 'cs=' + (vm.form.cs[0] / 10) + ' ';
            }
            else {
                new_query += 'cs>=' + (vm.form.cs[0] / 10) + ' cs<=' + (vm.form.cs[1] / 10) + ' ';
            }
            if (vm.form.ar[0] == vm.form.ar[1]) {
                new_query += 'ar=' + (vm.form.ar[0] / 10) + ' ';
            }
            else {
                new_query += 'ar>=' + (vm.form.ar[0] / 10) + ' ar<=' + (vm.form.ar[1] / 10) + ' ';
            }
            if (vm.form.od[0] == vm.form.od[1]) {
                new_query += 'od=' + (vm.form.od[0] / 10) + ' ';
            }
            else {
                new_query += 'od>=' + (vm.form.od[0] / 10) + ' od<=' + (vm.form.od[1] / 10) + ' ';
            }
            if (vm.form.hp[0] == vm.form.hp[1]) {
                new_query += 'hp=' + (vm.form.hp[0] / 10) + ' ';
            }
            else {
                new_query += 'hp>=' + (vm.form.hp[0] / 10) + ' hp<=' + (vm.form.hp[1] / 10) + ' ';
            }
            if (vm.form.bpm[0] == vm.form.bpm[1]) {
                new_query += 'bpm=' + (vm.form.bpm[0] / 10) + ' ';
            }
            else {
                new_query += 'bpm>=' + vm.form.bpm[0] + ' bpm<=' + vm.form.bpm[1] + ' ';
            }
            if (vm.form.length[0] == vm.form.length[1]) {
                new_query += 'length=' + vm.form.length[0] + ' ';
            }
            else {
                new_query += 'length>=' + vm.form.length[0] + ' length<=' + vm.form.length[1] + ' ';
            }
            new_query += vm.form.artist + ' ' + vm.form.title
            if (vm.form.creator.length > 1) {
                new_query += 'creator=' + vm.form.creator + ' ';
            }
            return new_query;
        },
        changeoffset: function (page = 1) {
            var vm = this;
            this.page = page;
            this.offset = 0;
            vm.getBeatmapData();
        },
        getBeatmapData: function () {
            var vm = this;
            this.load = true;
            window.history.replaceState('', document.title, "/main?mode="+vm.mode+'&status='+vm.rank+'&query='+vm.search_query);
            if (vm.creatorid > 1) {
                vm.getBeatmapDataByCreatorId();
            }
            else {
                if (vm.advenced != true) {
                    this.$axios.get("http://127.0.0.1:12413/api/v1/search", {
                        params: {
                            mode: this.mode,
                            amount: 48 * this.page,
                            status: this.rank,
                            query: this.search_query
                        }
                    }).then(function (response) {
                        vm.list = response.data;
                        vm.load = false;
                        vm.first_load = false;
                    });
                }
                else {
                    vm.getBeatmapDataAdvenced();
                }
            }
        },
        getBeatmapDataAdvenced: function () {
            var vm = this;
            this.load = true;
            var advenced_query = vm.makeAdvencedQuery();
            this.search_query = advenced_query;
            window.history.replaceState('', document.title, "/main?mode="+vm.mode+'&status='+vm.rank+'sort='+this.form.sort+'&order='+this.form.sort2+'&query='+vm.search_query);
            this.$axios.get("http://127.0.0.1:12413/api/v1/search", {
                params: {
                    offset: this.offset,
                    mode: this.mode,
                    amount: 48 * this.page,
                    status: this.rank,
                    sort: this.form.sort,
                    order: this.form.sort2,
                    query: this.search_query
                }
            }).then(function (response) {
                vm.list = response.data;
                vm.activeSearchDetails = ['0']; 
                vm.load = false;
            });
        },
        getBeatmapDataByCreatorId: function() {
            var vm = this;
            console.log("Creator ID: " + vm.creatorid);
            
            this.$axios.get("http://127.0.0.1:12413/api/v1/search", {
                params: {
                    offset: this.offset,
                    mode: this.mode,
                    amount: 48 * this.page,
                    status: this.rank,
                    query: this.search_query,
                    creator: this.creatorid
                }
            }).then(function (response) {
                vm.list = response.data;
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
        },
        onSubmit() {
            var vm = this;
            vm.advenced = true;
            vm.getBeatmapData();
        }
    }
});