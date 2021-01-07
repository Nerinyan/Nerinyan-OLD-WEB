Vue.component('beatmap', {
    props: ['beatmap'],
    delimiters: ["<%", "%>"],
    template: `                    
        <div class="beatmap-block">
            <div class="beatmap-single">
                <div class="beatmap-bg-default"></div>
                <a :href="'/s/' + beatmap.SetID" :id="beatmap.SetID" class="cardheader ranked"
                    :style="'background-image: url(https://assets.ppy.sh/beatmaps/' + beatmap.SetID + '/covers/card.jpg);'">
                    <div>
                        <div class="song-status">
                            <i :class="'fas fa-' + convertRankedStatusToico(beatmap.RankedStatus)"></i>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <span class="beatmap songname title"> <% beatmap.Title %></span>
                        <span class="beatmap songname creator">by <% beatmap.Artist %></span>
                    </div>
                </a>
                <div class="beatmapset-preview-elapsed-bar "></div>
                <div class="info">
                    <div class="desc">
                        mapped by <a class="song-author-name"> <% beatmap.Creator %></a>
                    </div>
                    <div class="beatmap-download-btn">
                        <a :href="'/d/' + beatmap.SetID" class="download-icon">
                            <i class="fa fa-download"></i>
                        </a>
                    </div>
                </div>
                <div class="more-info">
                    <div class="song-stats-block">
                        <el-tooltip class="item" effect="dark" content="Favorites count" placement="bottom">
                            <div class="song-stats">
                                <i class="fas fa-heart"></i> <% addCommas(beatmap.Favourites) %>
                            </div>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Play count" placement="bottom">
                            <div class="song-stats">
                                <i class="fas fa-play-circle"></i> 123456
                            </div>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="BPM" placement="bottom">
                            <div class="song-stats">
                                <i class="fas fa-music"></i> 185♪
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="version-list">
                    <el-tooltip placement="top" v-for="ii in beatmap.ChildrenBeatmaps" v-bind:key="ii.id">
                        <div slot="content" class="beatmap-tooltip">
                            <b><% ii.DiffName %></b>
                            <br/>
                            <div v-if="ii.DifficultyRating < 2">
                                <span class="easy beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 2.7) && (ii.DifficultyRating > 1.99)">
                                <span class="normal beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 4) && (ii.DifficultyRating > 2.69)">
                                <span class="hard beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 5.3) && (ii.DifficultyRating > 3.99)">
                                <span class="insane beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 6.5) && (ii.DifficultyRating > 5.29)">
                                <span class="expert beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                            </div>
                            <div v-else-if="ii.DifficultyRating > 6.49">
                                <span class="expertplus beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                            </div>
                        </div>
                        <div v-if="ii.DifficultyRating < 2">
                            <i class="mode-ico faa fa-extra-mode-osu easy"></i>
                        </div>
                        <div v-else-if="(ii.DifficultyRating < 2.7) && (ii.DifficultyRating > 1.99)">
                            <i class="mode-ico faa fa-extra-mode-osu normal"></i>
                        </div>
                        <div v-else-if="(ii.DifficultyRating < 4) && (ii.DifficultyRating > 2.69)">
                            <i class="mode-ico faa fa-extra-mode-osu hard"></i>
                        </div>
                        <div v-else-if="(ii.DifficultyRating < 5.3) && (ii.DifficultyRating > 3.99)">
                            <i class="mode-ico faa fa-extra-mode-osu insane"></i>
                        </div>
                        <div v-else-if="(ii.DifficultyRating < 6.5) && (ii.DifficultyRating > 5.29)">
                            <i class="mode-ico faa fa-extra-mode-osu expert"></i>
                        </div>
                        <div v-else-if="ii.DifficultyRating > 6.49">
                            <i class="mode-ico faa fa-extra-mode-osu expertplus"></i>
                        </div>
                    </el-tooltip>
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
            playing: false
        }
    },
    methods: {
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
                    result = "angle-double-down ranked";
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
                audioElement.volume = 0.3;
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
        }
    }
})