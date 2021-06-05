var beatmap = {
    props: ['beatmap'],
    delimiters: ["<%", "%>"],
    template: `                    
        <div class="beatmap-block">
            <div class="beatmap-single">
                <div class="beatmap-bg-default"></div>
                <a @click="redirectDownload(beatmap.SetID)" :id="beatmap.SetID" class="cardheader ranked"
                    :style="'background-image: url(https://assets.ppy.sh/beatmaps/' + beatmap.SetID + '/covers/cover.jpg?1622784772);'">
                    <div>
                        <div class="song-status">
                            <i :class="'fas fa-' + convertRankedStatusToico(beatmap.RankedStatus)"></i>
                        </div>
                        <div class="song-stats-block">
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" content="Favorites count" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-heart"></i> <% addCommas(beatmap.Favourites) %>
                                    </div>
                                </el-tooltip>   
                            </div>
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" content="Play count" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-play-circle"></i> <% addCommas(beatmap.Playcounts) %>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" content="BPM" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-music"></i> <% beatmap.BPM %>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" content="Beatmaps Count" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-clipboard-list"></i> <% beatmap.BeatmapCount %>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column creator-title">
                        <span class="beatmap songname title"> <% beatmap.Title %></span>
                        <span class="beatmap songname creator">by <% beatmap.Artist %></span>
                    </div>
                </a>
                <div class="info">
                    <div class="desc">
                        mapped by <a class="song-author-name" :href="'/main?creator=' + beatmap.CreatorID"> <% beatmap.Creator %></a>
                    </div>
                    <div class="beatmap-clipboard-btn">
                        <el-tooltip class="item" effect="dark" content="Copy Download URL" placement="top">
                            <a @click="clipboardDluri(beatmap.SetID)" class="clipboard-icon">
                                <i class="fas fa-clipboard"></i>
                            </a>
                        </el-tooltip>
                    </div>
                </div>
                <div class="version-list">
                    <div class="version-list-block" :id="'list-' + beatmap.SetID">
                        <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in beatmap.ChildrenBeatmaps" v-bind:key="bmap.id">
                            <div slot="content" class="beatmap-tooltip">
                                <div class="version-hoverlist-single">
                                    <div class="version-main-info">
                                        <span :class="'version-mode mode-ico insane faa fa-extra-mode-' + convertModeToico(bmap.Mode)"></span>
                                        <div class="version-diff">
                                            <span class="fas fa-star"></span><% addCommas((bmap.DifficultyRating).toFixed(2)) %>
                                        </div>
                                        <span class="version-name"><% bmap.DiffName %></span>
                                    </div>
                                    <div class="version-info">
                                        <div class="version-basic-info">
                                            <el-tooltip placement="top" effect="light">
                                                <div slot="content" class="beatmap-tooltip">
                                                    Total Length
                                                </div>
                                                <div class="version-info-line">
                                                    <div class="version-ico length"></div><% secondsToTime(bmap.TotalLength) %>
                                                </div>
                                            </el-tooltip>
                                            <el-tooltip placement="top" effect="light">
                                                <div slot="content" class="beatmap-tooltip">
                                                    BPM
                                                </div>
                                                <div class="version-info-line">
                                                    <div class="version-ico bpm"></div><% bmap.BPM %>
                                                </div>
                                            </el-tooltip>
                                            <el-tooltip placement="top" effect="light">
                                                <div slot="content" class="beatmap-tooltip">
                                                    Circle Count
                                                </div>
                                                <div class="version-info-line">
                                                    <div class="version-ico circlecount"></div><% addCommas(bmap.CircleCount) %>
                                                </div>
                                            </el-tooltip>
                                            <el-tooltip placement="top" effect="light">
                                                <div slot="content" class="beatmap-tooltip">
                                                    Slider Count
                                                </div>
                                                <div class="version-info-line-last">
                                                    <div class="version-ico slidercount"></div><% addCommas(bmap.SliderCount) %>
                                                </div>
                                            </el-tooltip>
                                        </div>
                                        <div class="version-more-info">
                                            <div class="version-more-info-line">
                                                <span class="version-more-info-text">Circle Size</span>
                                                <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.CS)"></el-progress>
                                            </div>
                                            <div class="version-more-info-line">
                                                <span class="version-more-info-text">HP Drain</span>
                                                <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.HP)"></el-progress>
                                            </div>
                                            <div class="version-more-info-line">
                                                <span class="version-more-info-text">Accuracy</span>
                                                <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.OD)"></el-progress>
                                            </div>
                                            <div class="version-more-info-line-last">
                                                <span class="version-more-info-text">Approach Rate</span>
                                                <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.AR)"></el-progress>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="version-list-single">
                                <i :class="'mode-ico ' + convertDiffToClass(bmap.DifficultyRating) +' faa fa-extra-mode-' + convertModeToico(bmap.Mode)"></i>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <span class="beatmapset-panel-prev beatmapset-panel__play">
                <span @click="play()" :class="'fa fa-' + (playing ? 'stop' : 'play')"></span>
            </span>
        </div>
        `,
    name: 'Beatmap',
    data() {
        return {
            playing: false,
            active: true
        }
    },
    methods: {
        format(percentage) {
            percentage = percentage / 10;
            return percentage
        },
        convertRankedStatusToText(rankedstatus){
            var result;
            switch(rankedstatus){
                default:
                case -2:
                    result = "Graveyard";
                    break;
                case -1:
                    result = "WIP";
                    break;
                case 0:
                    result = "Pending";
                    break;
                case 1:
                    result = "Ranked";
                    break;
                case 2:
                    result = "Approved";
                    break;
                case 3:
                    result = "Qualified";
                    break;
                case 4:
                    result = "Loved";
                    break;
            }
            return result; 
        },
        convertDiffToClass(diff){
            if (diff < 2) {
                return "easy"
            }
            if (diff < 2.7) {
                return "normal"
            }
            if (diff < 4) {
                return "hard"
            }
            if (diff < 5.3) {
                return "insane"
            }
            if (diff < 6.5) {
                return "expert"
            }
            if (diff > 6.49) {
                return "expertplus"
            }
        },
        convertRankedStatusToico(rankedstatus){
            var result;
            switch(rankedstatus){
                default:
                case -2:
                    result = "question unranked";
                    break;
                case -1:
                    result = "question unranked";
                    break;
                case 0:
                    result = "question unranked";
                    break;
                case 1:
                    result = "angle-double-up ranked";
                    break;
                case 2:
                    result = "check approved";
                    break;
                case 3:
                    result = "check qualified";
                    break;
                case 4:
                    result = "heart loved";
                    break;
            }
            return result; 
        },
        convertModeToico(mode){
            var result;
            switch(mode){
                default:
                case 0:
                    result = "osu";
                    break;
                case 1:
                    result = "taiko";
                    break;
                case 2:
                    result = "fruits";
                    break;
                case 3:
                    result = "mania";
                    break;
            }
            return result; 
        },
        addCommas(nStr){
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        convertPercent(before){
            after = before * 10
            return after
        },
        addSpaces(nStr){
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ' ' + '$2');
            }
            return x1 + x2;
        },
        onFinish: function() {
            this.playing = false;
            var id = thos.beatmap.SetID;
            var audio = $('#audio_' + id)[0];
            audio.pause();
            audio.currentTime = 0;
        },
        play: function() {
            var audioElement = window.audioElement;
            var vm = this;
            if (audioElement && audioElement.currentTime > 0) {
                audioElement.pause();
                audioElement.currentTime = 0;
                audioElement = null;
                window.audioElement = null;
                if (vm.playing) {
                    vm.playing = false;
                    return;
                }
            }
            if (!audioElement) {
                audioElement = document.createElement('audio');
                window.audioElement = audioElement;
            }
            audioElement.setAttribute('src', 'https://b.ppy.sh/preview/' + this.beatmap.SetID + '.mp3');
            audioElement.addEventListener('loadeddata', function() {
                if (vm.playing) return;
                vm.playing = true;
                audioElement.volume = 0.15;
                audioElement.play();
            });

            audioElement.addEventListener('ended', function() {
                vm.playing = false;
                window.audioElement = null;
            }, false);

            audioElement.addEventListener('pause', function() {
                vm.playing = false;
                return
            }, false);
        },
        createBmpDlUri: function(setid){
            console.log("request generate beatmap download url...");
            json = {
                'server': dlserver,
                'beatmapsetid': setid
            };
            let json2string = JSON.stringify(json);
            var conv = btoa(json2string);
            var downloadUrl = "https://api.nerina.pw/download?b=" + conv;
            console.log("generated!: " + downloadUrl);
            return downloadUrl;
        },
        redirectDownload: function(setid){
            uri = this.createBmpDlUri(setid);
            window.location.href = uri;
        },
        clipboardDluri: function(setid){
            uri = this.createBmpDlUri(setid);
            const t = document.createElement("textarea");
            document.body.appendChild(t);
            t.value = uri;
            t.select();
            document.execCommand('copy');
            document.body.removeChild(t);
            this.$notify({
                title: 'Nerinyan',
                message: 'copied!',
                type: 'success'
            });
        }
    }
}

Vue.use(window.VueTimeago);
Vue.config.devtools = true
new Vue({
    el: "#app",
    components: {
        'beatmap': beatmap
    },
    data() {
        return {
            first_load: true,
            loadPercent: 0,
            colors: [
                {color: '#f56c6c', percentage: 20},
                {color: '#e6a23c', percentage: 40},
                {color: '#5cb87a', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#6f7ad3', percentage: 100}
            ],
            advenced: false,
            mode: m,
            load: true,
            rank: s,
            visible: false,
            fullscreenLoading: false,
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
            },
            downloadserver: [{
                serverid: 0,
                listlabel: 'All Server'
            }, {
                serverid: 1,
                listlabel: 'Main Server Only'
            }, {
                serverid: 2,
                listlabel: 'Sub Server Only'
            }],
            serverid: 0
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
        serverid() {
            dlserver = this.serverid;
        }
    },
    created() {
        var vm = this;
        $((function () {
            $(window).scroll((function () {
                $(window).scrollTop() + $(window).height() > ($(document).height() - 300) && 0 == vm.load && vm.list.length >= 48 * vm.page && vm.changeoffset(vm.page + 1, !0)
            })), vm.getBeatmapData()
        }));
    },
    methods: {
        openFullScreen1() {
            this.fullscreenLoading = true;
            setTimeout(() => {
            this.fullscreenLoading = false;
            }, 2000);
        },
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
        runloadPercent() {
            var vm = this;
            while (this.loadPercent < 100){
                vm.loadPercent += 5;
            }
        },
        getBeatmapData: function () {
            var vm = this;
            vm.load = true;
            vm.fullscreenLoading = true;
            window.history.replaceState('', document.title, "/main?mode="+vm.mode+'&status='+vm.rank+'&query='+vm.search_query);
            if (vm.creatorid > 1) {
                vm.getBeatmapDataByCreatorId();
            }
            else {
                if (vm.advenced != true) {
                    this.$axios.get("https://nerina.pw/api/v2/search", {
                        params: {
                            mode: this.mode,
                            amount: 48 * this.page,
                            status: this.rank,
                            query: this.search_query
                        }
                    },).then(function (response) {
                        vm.list = response.data;
                        vm.load = false;
                        vm.first_load = false;
                        this.fullscreenLoading = false;
                        this.loadPercent = 100;
                        setInterval(() => {
                            this.loadPercent = 0;
                        }, 200);
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
            this.$axios.get("https://nerina.pw/api/v2/search", {
                params: {
                    offset: this.offset,
                    mode: this.mode,
                    amount: 48 * this.page,
                    status: this.rank,
                    sort: this.form.sort,
                    order: this.form.sort2,
                    query: this.search_query
                },
                onDownloadProgress: progressEvent => {
                    let percentCompleted = Math.floor((progressEvent.loaded * 100) / 100000);
                    // })
                    console.log("load now", percentCompleted);
                    this.loadPercent = percentCompleted;
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
            
            this.$axios.get("https://nerina.pw/api/v2/search", {
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