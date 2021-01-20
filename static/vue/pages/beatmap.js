Vue.component('beatmap', {
    props: ['beatmap'],
    delimiters: ["<%", "%>"],
    template: `                    
        <div class="beatmap-block">
            <div class="beatmap-single">
                <div class="beatmap-bg-default"></div>
                <a :href="'/d/' + beatmap.SetID" :id="beatmap.SetID" class="cardheader ranked"
                    :style="'background-image: url(https://assets.ppy.sh/beatmaps/' + beatmap.SetID + '/covers/card.jpg);'">
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
                    <div class="beatmap-download-btn">
                        <a :href="'/d/' + beatmap.SetID" class="download-icon">
                            <i class="fa fa-download"></i>
                        </a>
                    </div>
                </div>
                <div class="version-list">
                    <div class="version-list-block">
                        <el-tooltip placement="top" v-for="ii in beatmap.ChildrenBeatmaps" v-bind:key="ii.id">
                            <div slot="content" class="beatmap-tooltip">
                                <div v-if="ii.DifficultyRating < 2">
                                    <b><% ii.DiffName %></b> <span class="easy beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                                </div>
                                <div v-else-if="(ii.DifficultyRating < 2.7) && (ii.DifficultyRating > 1.99)">
                                    <b><% ii.DiffName %></b> <span class="normal beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                                </div>
                                <div v-else-if="(ii.DifficultyRating < 4) && (ii.DifficultyRating > 2.69)">
                                    <b><% ii.DiffName %></b> <span class="hard beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                                </div>
                                <div v-else-if="(ii.DifficultyRating < 5.3) && (ii.DifficultyRating > 3.99)">
                                    <b><% ii.DiffName %></b> <span class="insane beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                                </div>
                                <div v-else-if="(ii.DifficultyRating < 6.5) && (ii.DifficultyRating > 5.29)">
                                    <b><% ii.DiffName %></b> <span class="expert beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                                </div>
                                <div v-else-if="ii.DifficultyRating > 6.49">
                                    <b><% ii.DiffName %></b> <span class="expertplus beatmap-diff-text"><% addCommas((ii.DifficultyRating).toFixed(2)) %> <i class="fas fa-star"></i></span>
                                </div>
                                <i class="fas fa-music"></i> <b><% ii.BPM %></b> | <b><i class="el-icon-timer more_thic"></i></b> <% secondsToTime(ii.TotalLength) %>
                                <br/>
                                <b>CS: </b><% ii.CS %> | <b>AR: </b><% ii.AR %> | <b>OD: </b><% ii.OD %> | <b>HP: </b><% ii.HP %>
                                <br/>
                                <b>Objects: </b><% addCommas(ii.CircleCount + ii.SpinnerCount + ii.SliderCount) %>
                            </div>
                            <div v-if="ii.DifficultyRating < 2">
                                <i :class="'mode-ico easy faa fa-extra-mode-' + convertModeToico(ii.Mode)"></i>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 2.7) && (ii.DifficultyRating > 1.99)">
                                <i :class="'mode-ico normal faa fa-extra-mode-' + convertModeToico(ii.Mode)"></i>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 4) && (ii.DifficultyRating > 2.69)">
                                <i :class="'mode-ico hard faa fa-extra-mode-' + convertModeToico(ii.Mode)"></i>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 5.3) && (ii.DifficultyRating > 3.99)">
                                <i :class="'mode-ico insane faa fa-extra-mode-' + convertModeToico(ii.Mode)"></i>
                            </div>
                            <div v-else-if="(ii.DifficultyRating < 6.5) && (ii.DifficultyRating > 5.29)">
                                <i :class="'mode-ico expert faa fa-extra-mode-' + convertModeToico(ii.Mode)"></i>
                            </div>
                            <div v-else-if="ii.DifficultyRating > 6.49">
                                <i :class="'mode-ico expertplus faa fa-extra-mode-' + convertModeToico(ii.Mode)"></i>
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
        }
    }
})