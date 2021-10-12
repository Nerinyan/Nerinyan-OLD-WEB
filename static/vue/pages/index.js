var beatmap = {
    props: ['beatmap'],
    delimiters: ["<%", "%>"],
    template: `                    
        <div class="beatmap-block xyz-in" xyz="fade up">
            <div class="beatmap-single">
                <div class="beatmap-bg-default"></div>
                <a :href="createBmpDlUri(beatmap.id, false)" target="_blank" :id="beatmap.id" class="cardheader ranked"
                    :style="'background-image: linear-gradient(to right, #00000099, #ffe4e100), url(https://assets.ppy.sh/beatmaps/' + beatmap.id + '/covers/cover.jpg?1622784772);'">
                    <div class="beatamp-header-block">
                        <div>
                            <div :class="'song-status ' + convertRankedStatusToText(beatmap.ranked)">
                                <% convertRankedStatusToText(beatmap.ranked) %>
                            </div>
                            
                            <div class="song-status nsfw" v-if="beatmap.nsfw" v-show="beatmap.nsfw">
                                EXPLICIT
                            </div>
                        </div>
                        <div class="song-stats-block">
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" :content="'Favorites count: ' + addCommas(beatmap.favourite_count)" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-heart"></i> <% addCommas(beatmap.favourite_count) %>
                                    </div>
                                </el-tooltip>   
                            </div>
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" :content="'Play count:' + addCommas(beatmap.play_count)" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-play-circle"></i> <% addCommas(beatmap.play_count) %>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" :content="'BPM: ' + parseFloat(beatmap.bpm)" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-music"></i> <% parseFloat(beatmap.bpm) %>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="song-stats">
                                <el-tooltip class="item" effect="dark" :content="'Beatmaps Count: ' + beatmap.beatmaps.length" placement="top">
                                    <div class="song-stats">
                                        <i class="fas fa-clipboard-list"></i> <% beatmap.beatmaps.length %>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="song-stats" v-if="beatmap.video == 1" v-show="beatmap.video == 1">
                                <el-tooltip class="item" effect="dark" content="This beatmap contains video" placement="top">
                                    <div class="song-stats">
                                        <i class="betmaphasvideo fas fa-video"></i>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column creator-title">
                        <span class="beatmap songname title"> <% beatmap.title %></span>
                        <span class="beatmap songname creator">by <% beatmap.artist %></span>
                    </div>
                </a>
                <div :class="'beatmap-preview-progressbar '+(playing ? 'playing' : '')">
                </div>
                <div class="info">
                    <div class="desc">
                        mapped by <a class="song-author-name" :href="'/main?creator=' + beatmap.user_id"> <% beatmap.creator %></a>
                    </div>
                    <div class="beatmap-clipboard-btn">
                        <el-tooltip class="item" effect="dark" content="Copy Download URL" placement="top">
                            <a @click="clipboardDluri(beatmap.id, false)" class="clipboard-icon">
                                <i class="copyico fas fa-paste" :id="'Copy-' + beatmap.id"></i>
                            </a>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Download" placement="top" v-if="beatmap.video == 0">
                            <a :href="createBmpDlUri(beatmap.id, false)" target="_blank" class="clipboard-icon">
                                <i class="copyico fas fa-download"></i>
                            </a>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Download with video" placement="top" v-if="beatmap.video == 1">
                            <a :href="createBmpDlUri(beatmap.id, false)" target="_blank" class="clipboard-icon">
                                <i class="copyico fas fa-download"></i>
                            </a>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Download without video" placement="top" v-if="beatmap.video == 1">
                            <a :href="createBmpDlUri(beatmap.id, true)" target="_blank" class="clipboard-icon">
                                <i class="copyico fas fa-video-slash"></i>
                            </a>
                        </el-tooltip>
                    </div>
                </div>
                <div class="version-list">
                    <i :id="'versiondropdownbtn-' + beatmap.id" class="version-dropdownbtn fad fa-sort-down" v-on:click="versionHover(beatmap.id)"></i>
                    <div class="version-list-block" :id="'versionlist-' + beatmap.id">
                    <div class="version-list-block-in-block hoverd" :id="'hoverlist-' + beatmap.id" xyz="fade up">
                        <div class="hover-list-block" v-if="versions.std.length > 0" v-show="versions.std.length > 0">
                            <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.std" v-bind:key="bmap.id">
                                <div slot="content" class="beatmap-tooltip">
                                    <div class="version-hoverlist-single">
                                        <div class="version-main-info">
                                            <span :class="'version-mode mode-ico  faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                            <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                            </div>
                                            <span class="version-name"><% bmap.version %></span>
                                        </div>
                                        <div class="version-info">
                                            <div class="version-basic-info">
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        Total Length
                                                    </div>
                                                    <div class="version-info-line">
                                                        <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                    </div>
                                                </el-tooltip>
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        BPM
                                                    </div>
                                                    <div class="version-info-line">
                                                        <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                    </div>
                                                </el-tooltip>
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        Circle Count
                                                    </div>
                                                    <div class="version-info-line">
                                                        <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                    </div>
                                                </el-tooltip>
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        Slider Count
                                                    </div>
                                                    <div class="version-info-line-last">
                                                        <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                    </div>
                                                </el-tooltip>
                                            </div>
                                            <div class="version-more-info">
                                                <div class="version-more-info-line">
                                                    <span class="version-more-info-text">Circle Size</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                </div>
                                                <div class="version-more-info-line">
                                                    <span class="version-more-info-text">HP Drain</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                </div>
                                                <div class="version-more-info-line">
                                                    <span class="version-more-info-text">Accuracy</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                </div>
                                                <div class="version-more-info-line-last">
                                                    <span class="version-more-info-text">Approach Rate</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-list-single">
                                    <div class="hover-list-single-mode">
                                        <span :class="'hover-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                    </div>
                                    <div class="hover-list-single-diff">
                                        <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                            <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas(bmap.difficulty_rating.toFixed(2)) %></span>
                                        </div>
                                        <span class="version-name"><% bmap.version %></span>
                                    </div>
                                </div>
                            </el-tooltip>
                        </div>
                        <div class="hover-list-block" v-if="versions.taiko.length > 0" v-show="versions.taiko.length > 0">
                            <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.taiko" v-bind:key="bmap.id">
                                <div slot="content" class="beatmap-tooltip">
                                    <div class="version-hoverlist-single">
                                        <div class="version-main-info">
                                            <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                            <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                            </div>
                                            <span class="version-name"><% bmap.version %></span>
                                        </div>
                                        <div class="version-info">
                                            <div class="version-basic-info">
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        Total Length
                                                    </div>
                                                    <div class="version-info-line">
                                                        <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                    </div>
                                                </el-tooltip>
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        BPM
                                                    </div>
                                                    <div class="version-info-line">
                                                        <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                    </div>
                                                </el-tooltip>
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        Circle Count
                                                    </div>
                                                    <div class="version-info-line">
                                                        <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                    </div>
                                                </el-tooltip>
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content" class="beatmap-tooltip">
                                                        Slider Count
                                                    </div>
                                                    <div class="version-info-line-last">
                                                        <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                    </div>
                                                </el-tooltip>
                                            </div>
                                            <div class="version-more-info">
                                                <div class="version-more-info-line">
                                                    <span class="version-more-info-text">Circle Size</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                </div>
                                                <div class="version-more-info-line">
                                                    <span class="version-more-info-text">HP Drain</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                </div>
                                                <div class="version-more-info-line">
                                                    <span class="version-more-info-text">Accuracy</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                </div>
                                                <div class="version-more-info-line-last">
                                                    <span class="version-more-info-text">Approach Rate</span>
                                                    <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-list-single">
                                    <div class="hover-list-single-mode">
                                        <span :class="'hover-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                    </div>
                                    <div class="hover-list-single-diff">
                                        <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                            <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas(bmap.difficulty_rating.toFixed(2)) %></span>
                                        </div>
                                        <span class="version-name"><% bmap.version %></span>
                                    </div>
                                </div>
                            </el-tooltip>
                            </div>
                            <div class="hover-list-block" v-if="versions.ctb.length > 0" v-show="versions.ctb.length > 0">
                                <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.ctb" v-bind:key="bmap.id">
                                    <div slot="content" class="beatmap-tooltip">
                                        <div class="version-hoverlist-single">
                                            <div class="version-main-info">
                                                <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                                <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                    <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                                </div>
                                                <span class="version-name"><% bmap.version %></span>
                                            </div>
                                            <div class="version-info">
                                                <div class="version-basic-info">
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Total Length
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            BPM
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Circle Count
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Slider Count
                                                        </div>
                                                        <div class="version-info-line-last">
                                                            <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                        </div>
                                                    </el-tooltip>
                                                </div>
                                                <div class="version-more-info">
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Circle Size</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">HP Drain</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Accuracy</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line-last">
                                                        <span class="version-more-info-text">Approach Rate</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="hover-list-single">
                                        <div class="hover-list-single-mode">
                                            <span :class="'hover-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                        </div>
                                        <div class="hover-list-single-diff">
                                            <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas(bmap.difficulty_rating.toFixed(2)) %></span>
                                            </div>
                                            <span class="version-name"><% bmap.version %></span>
                                        </div>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="hover-list-block" v-if="versions.mania.length > 0" v-show="versions.mania.length > 0">
                                <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.mania" v-bind:key="bmap.id">
                                    <div slot="content" class="beatmap-tooltip">
                                        <div class="version-hoverlist-single">
                                            <div class="version-main-info">
                                                <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                                <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                    <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                                </div>
                                                <span class="version-name"><% bmap.version %></span>
                                            </div>
                                            <div class="version-info">
                                                <div class="version-basic-info">
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Total Length
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            BPM
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Circle Count
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Slider Count
                                                        </div>
                                                        <div class="version-info-line-last">
                                                            <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                        </div>
                                                    </el-tooltip>
                                                </div>
                                                <div class="version-more-info">
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Circle Size</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">HP Drain</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Accuracy</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line-last">
                                                        <span class="version-more-info-text">Approach Rate</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="hover-list-single">
                                        <div class="hover-list-single-mode">
                                            <span :class="'hover-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                        </div>
                                        <div class="hover-list-single-diff">
                                            <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas(bmap.difficulty_rating.toFixed(2)) %></span>
                                            </div>
                                            <span class="version-name"><% bmap.version %></span>
                                        </div>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                        <div :id="'versionlist-block-' + beatmap.id" class="version-list-block-original">
                            <div class="version-list-miniblock" :id="'versionlist-std-' + beatmap.id" v-if="versions.std.length >= 1">
                                <span class="version-mode mode-ico faa fa-extra-mode-osu"></span>
                                <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.std" v-bind:key="bmap.id">
                                    <div slot="content" class="beatmap-tooltip">
                                        <div class="version-hoverlist-single">
                                            <div class="version-main-info">
                                                <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                                <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                    <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                                </div>
                                                <span class="version-name"><% bmap.version %></span>
                                            </div>
                                            <div class="version-info">
                                                <div class="version-basic-info">
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Total Length
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            BPM
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Circle Count
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Slider Count
                                                        </div>
                                                        <div class="version-info-line-last">
                                                            <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                        </div>
                                                    </el-tooltip>
                                                </div>
                                                <div class="version-more-info">
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Circle Size</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">HP Drain</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Accuracy</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line-last">
                                                        <span class="version-more-info-text">Approach Rate</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <i :class="'mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></i>
                                    <div :class="'version-list-single ' + convertDiffToClass(bmap.difficulty_rating)">
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="version-list-miniblock" :id="'versionlist-taiko-' + beatmap.id" v-if="versions.taiko.length >= 1">
                                <span class="version-mode mode-ico faa fa-extra-mode-taiko"></span>
                                <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.taiko" v-bind:key="bmap.id">
                                    <div slot="content" class="beatmap-tooltip">
                                        <div class="version-hoverlist-single">
                                            <div class="version-main-info">
                                                <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                                <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                    <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                                </div>
                                                <span class="version-name"><% bmap.version %></span>
                                            </div>
                                            <div class="version-info">
                                                <div class="version-basic-info">
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Total Length
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            BPM
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Circle Count
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Slider Count
                                                        </div>
                                                        <div class="version-info-line-last">
                                                            <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                        </div>
                                                    </el-tooltip>
                                                </div>
                                                <div class="version-more-info">
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Circle Size</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">HP Drain</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Accuracy</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line-last">
                                                        <span class="version-more-info-text">Approach Rate</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <i :class="'mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></i>
                                    <div :class="'version-list-single ' + convertDiffToClass(bmap.difficulty_rating)">
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="version-list-miniblock" :id="'versionlist-ctb-' + beatmap.id" v-if="versions.ctb.length >= 1">
                                <span class="version-mode mode-ico faa fa-extra-mode-fruits"></span>
                                <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.ctb" v-bind:key="bmap.id">
                                    <div slot="content" class="beatmap-tooltip">
                                        <div class="version-hoverlist-single">
                                            <div class="version-main-info">
                                                <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                                <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                    <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                                </div>
                                                <span class="version-name"><% bmap.version %></span>
                                            </div>
                                            <div class="version-info">
                                                <div class="version-basic-info">
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Total Length
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            BPM
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Circle Count
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Slider Count
                                                        </div>
                                                        <div class="version-info-line-last">
                                                            <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                        </div>
                                                    </el-tooltip>
                                                </div>
                                                <div class="version-more-info">
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Circle Size</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">HP Drain</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Accuracy</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line-last">
                                                        <span class="version-more-info-text">Approach Rate</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <i :class="'mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></i>
                                    <div :class="'version-list-single ' + convertDiffToClass(bmap.difficulty_rating)">
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="version-list-miniblock" :id="'versionlist-mania-' + beatmap.id" v-if="versions.mania.length >= 1">
                                <span class="version-mode mode-ico faa fa-extra-mode-mania"></span>
                                <el-tooltip popper-class="bmap-tooltip" placement="top" v-for="bmap in versions.mania" v-bind:key="bmap.id">
                                    <div slot="content" class="beatmap-tooltip">
                                        <div class="version-hoverlist-single">
                                            <div class="version-main-info">
                                                <span :class="'version-mode mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></span>
                                                <div :class="'version-diff ver-' + convertDiffToClass(bmap.difficulty_rating)">
                                                    <span class="version-diff-txt"><i class="fas fa-star"></i> <% addCommas((bmap.difficulty_rating).toFixed(2)) %></span>
                                                </div>
                                                <span class="version-name"><% bmap.version %></span>
                                            </div>
                                            <div class="version-info">
                                                <div class="version-basic-info">
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Total Length
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico length"></div><% secondsToTime(bmap.total_length) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            BPM
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico bpm"></div><% parseFloat(bmap.bpm) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Circle Count
                                                        </div>
                                                        <div class="version-info-line">
                                                            <div class="version-ico circlecount"></div><% addCommas(bmap.count_circles) %>
                                                        </div>
                                                    </el-tooltip>
                                                    <el-tooltip placement="top" effect="light">
                                                        <div slot="content" class="beatmap-tooltip">
                                                            Slider Count
                                                        </div>
                                                        <div class="version-info-line-last">
                                                            <div class="version-ico slidercount"></div><% addCommas(bmap.count_sliders) %>
                                                        </div>
                                                    </el-tooltip>
                                                </div>
                                                <div class="version-more-info">
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Circle Size</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.cs)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">HP Drain</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.drain)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line">
                                                        <span class="version-more-info-text">Accuracy</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.accuracy)"></el-progress>
                                                    </div>
                                                    <div class="version-more-info-line-last">
                                                        <span class="version-more-info-text">Approach Rate</span>
                                                        <el-progress :text-inside="true" :format="format" stroke-width="16" :percentage="convertPercent(bmap.ar)"></el-progress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <i :class="'mode-ico faa fa-extra-mode-' + convertModeToico(bmap.mode_int)"></i>
                                    <div :class="'version-list-single ' + convertDiffToClass(bmap.difficulty_rating)">
                                    </div>
                                </el-tooltip>
                            </div>
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
            active: true,
            copied: false,
            ishover: false,
            versions: {
                'std': [],
                'taiko': [],
                'ctb': [],
                'mania': [],
            }
        }
    },
    created() {
        var vm = this;
        vm.resortBeatmaps(vm.beatmap);
    },
    methods: {
        format(percentage) {
            percentage = percentage / 10;
            return percentage
        },
        versionHover(bid) {
            var versionblock = document.getElementById('versionlist-block-' + bid);
            var hoverblock = document.getElementById('hoverlist-' + bid);
            var dropdownbtn = document.getElementById('versiondropdownbtn-' + bid);
            var vm = this;
            if (vm.ishover) {
                vm.ishover = false;
                dropdownbtn.classList.toggle("fa-sort-up");
                dropdownbtn.classList.toggle("fa-sort-down");
                hoverblock.classList.add("hoverd");
                hoverblock.classList.add("xyz-in");
                versionblock.classList.remove("hoverd");
            } else {
                vm.ishover = true;
                dropdownbtn.classList.toggle("fa-sort-up");
                dropdownbtn.classList.toggle("fa-sort-down");
                hoverblock.classList.remove("hoverd");
                hoverblock.classList.remove("xyz-in");
                versionblock.classList.add("hoverd");

            }
        },
        resortBeatmaps(bmp) {
            var vm = this;
            for (i in bmp.beatmaps) {
                var bmap = bmp.beatmaps[i];
                switch (bmap.mode_int) {
                    case 0:
                        vm.versions.std.push(bmap);
                        break;
                    case 1:
                        vm.versions.taiko.push(bmap);
                        break;
                    case 2:
                        vm.versions.ctb.push(bmap);
                        break;
                    case 3:
                        vm.versions.mania.push(bmap);
                        break;
                    default:
                        vm.versions.std.push(bmap);
                        break;
                }
            }
        },
        convertRankedStatusToText(rankedstatus) {
            var result;
            switch (rankedstatus) {
                default:
                case -2:
                    result = "GRAVEYARD";
                    break;
                case -1:
                    result = "WIP";
                    break;
                case 0:
                    result = "PENDING";
                    break;
                case 1:
                    result = "RANKED";
                    break;
                case 2:
                    result = "APPROVED";
                    break;
                case 3:
                    result = "QUALIFIED";
                    break;
                case 4:
                    result = "LOVED";
                    break;
            }
            return result;
        },
        convertDiffToClass(diff) {
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
        convertRankedStatusToico(rankedstatus) {
            var result;
            switch (rankedstatus) {
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
        convertModeToico(mode) {
            var result;
            switch (mode) {
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
        addCommas(nStr) {
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
        convertPercent(before) {
            after = before * 10
            return after
        },
        addSpaces(nStr) {
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
        onFinish: function () {
            this.playing = false;
            var id = this.beatmap.id;
            var audio = $('#audio_' + id)[0];
            audio.pause();
            audio.currentTime = 0;
        },
        play: function () {
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
            audioElement.setAttribute('src', 'https://b.ppy.sh/preview/' + this.beatmap.id + '.mp3');
            audioElement.addEventListener('loadeddata', function () {
                if (vm.playing) return;
                vm.playing = true;
                audioElement.volume = 0.2;
                audioElement.play();
            });

            audioElement.addEventListener('ended', function () {
                vm.playing = false;
                window.audioElement = null;
            }, false);

            audioElement.addEventListener('pause', function () {
                vm.playing = false;
                return
            }, false);
        },
        createBmpDlUri: function (id, video) {
            var downloadUrl = "https://nerina.pw/d/" + id + "?server=" + dlserver;
            if (video) {
                downloadUrl += "&noVideo=1";
            }
            return downloadUrl;
        },
        redirectDownload: function (id) {
            uri = this.createBmpDlUri(id);
            window.location.href = uri;
        },
        clipboardDluri: function (id) {
            uri = this.createBmpDlUri(id);
            const t = document.createElement("textarea");
            document.body.appendChild(t);
            t.value = uri;
            t.select();
            document.execCommand('copy');
            document.body.removeChild(t);
            const aa = document.getElementById("Copy-" + id);
            aa.className = "copyico fas fa-check";
            setTimeout(function () {
                aa.className = "copyico fas fa-paste";
            }, 2500);
        }
    }
}

Vue.use(window.VueTimeago);
Vue.prototype.downloadServer = 0;
Vue.config.devtools = true
new Vue({
    el: "#app",
    components: {
        'beatmap': beatmap
    },
    data() {
        return {
            first_load: true,
            colors: [{
                    color: '#f56c6c',
                    percentage: 20
                },
                {
                    color: '#e6a23c',
                    percentage: 40
                },
                {
                    color: '#5cb87a',
                    percentage: 60
                },
                {
                    color: '#1989fa',
                    percentage: 80
                },
                {
                    color: '#6f7ad3',
                    percentage: 100
                }
            ],
            mode: m,
            load: true,
            rank: s,
            nsfw: nsfw,
            sort: sort,
            extra: extra,
            visible: false,
            fullscreenLoading: false,
            list: [],
            temp_list: [],
            page: 0,
            offset: 0,
            search_query: q,
            creatorid: creator,
            delay: null,
            activeSearchDetails: ['0'],
            isExpand: false,
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
            serverid: dlserver,
            novideo: 0
        }
    },
    watch: {
        mode() {
            this.list = [];
            this.page = 0;
            if (window.audioElement != null) {
                window.audioElement.pause();
            }
            this.getBeatmapData();
        },
        rank() {
            this.list = [];
            this.page = 0;
            if (window.audioElement != null) {
                window.audioElement.pause();
            }
            this.getBeatmapData();
        },
        search_query() {
            var vm = this;
            clearTimeout(this.delay);
            this.delay = setTimeout(function () {
                vm.list = [];
                vm.page = 0;
                if (window.audioElement != null) {
                    window.audioElement.pause();
                }
                vm.chageSearch_Query();
            }, 500);
        },
        nsfw() {
            this.list = [];
            this.page = 0;
            if (window.audioElement != null) {
                window.audioElement.pause();
            }
            this.getBeatmapData();
        },
        extra() {
            this.list = [];
            this.page = 0;
            if (window.audioElement != null) {
                window.audioElement.pause();
            }
            this.getBeatmapData();
        },
        sort() {
            this.list = [];
            this.page = 0;
            if (window.audioElement != null) {
                window.audioElement.pause();
            }
            this.getBeatmapData();
        },
        creatorid() {
            this.list = [];
            this.getBeatmapData();
        },
        serverid() {
            console.log("download server changed.")
            dlserver = this.serverid;
            this.downloadServer = this.serverid;
            this.temp_list = this.list;
            this.list = [];
            this.page = 0;
            setInterval(() => {
                this.list = this.temp_list;
            }, 5);
        },
        novideo() {
            dlNovideo = this.novideo;
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
        convertServerStatus(type) {
            var vm = this;
            if (vm.status_server.MainServer == 1 && vm.status_server.SubServer == 1) {
                switch (type) {
                    case 'title':
                        return "Nerinyan's All services are running normally!"
                    case 'description':
                        return "네리냥의 모든 서비스가 정상적으로 작동되고 있습니다!"
                    case 'style':
                        return "success"
                    default:
                        return 'error';
                }
            }
            else if (vm.status_server.MainServer == 1 && vm.status_server.SubServer == 0) {
                switch (type) {
                    case 'title':
                        return "Nerinyan's Sub Download server has some problemes now..."
                    case 'description':
                        return "네리냥의 미러 서버에 현재 문제가 발생하였습니다."
                    case 'style':
                        return "warning"
                    default:
                        return 'error'
                }
            }
            else if (vm.status_server.MainServer == 0 && vm.status_server.SubServer == 1) {
                switch (type) {
                    case 'title':
                        return "Nerinyan's Main server has some problemes now..."
                    case 'description':
                        return "네리냥의 메인 서버에 현재 문제가 발생하였습니다."
                    case 'style':
                        return "warning"
                    default:
                        return 'error'
                }
            }
        },
        toggleExpand() {
            var vm = this;
            if (vm.isExpand) {
                vm.isExpand = false;
            } else {
                vm.isExpand = true;
            }
            // console.log(vm.isExpand);
        },
        convertSortIcon(sortname) {
            var vm = this;
            var result = ''
            if (sortname.includes('desc')) {
                result = 'down';
            } else {
                result = 'down';
                if (sortname.includes('asc')) {
                    result = 'up';
                }
            }
            return result;
        },
        changeSort(sortname) {
            var vm = this;
            if (vm.sort.includes(sortname)) {
                if (vm.sort.includes('desc')) {
                    vm.sort = sortname + '_asc';
                } else {
                    vm.sort = sortname + '_desc';
                }
            } else {
                vm.sort = sortname + '_desc';
            }
            // console.log(vm.sort);
        },
        extraChanged(extra) {
            var vm = this;
            if (extra == "video") {
                if (vm.extra.includes('video')) {
                    if (vm.extra.includes('storyboard')) {
                        vm.extra = vm.extra.replace('.video', '');
                    } else {
                        vm.extra = vm.extra.replace('video', '');
                    }
                } else {
                    if (vm.extra.includes('storyboard')) {
                        vm.extra += ".video";
                    } else {
                        vm.extra += "video";
                    }
                }
            } else {
                if (vm.extra.includes('storyboard')) {
                    vm.extra = vm.extra.replace('storyboard', '');
                } else {
                    if (vm.extra.includes('video')) {
                        vm.extra = "storyboard.video";
                    } else {
                        vm.extra += "storyboard";
                    }
                }
            }
        },
        generateHref() {
            var vm = this;
            var uri = '/main';
            switch (vm.mode) {
                case -1:
                    break;
                case 0:
                    if (uri.length >= 6) {
                        uri += "&m=0"
                    } else {
                        uri += "?m=0"
                    }
                    break;
                case 1:
                    if (uri.length >= 6) {
                        uri += "&m=1"
                    } else {
                        uri += "?m=1"
                    }
                    break;
                case 2:
                    if (uri.length >= 6) {
                        uri += "&m=2"
                    } else {
                        uri += "?m=2"
                    }
                    break;
                case 3:
                    if (uri.length >= 6) {
                        uri += "&m=3"
                    } else {
                        uri += "?m=3"
                    }
                    break;
                default:
                    break;
            }
            switch (vm.rank) {
                case 'any':
                    if (uri.length >= 6) {
                        uri += "&s=any"
                    } else {
                        uri += "?s=any"
                    }
                    break;
                case '':
                    break;
                case 'ranked':
                    if (uri.length >= 6) {
                        uri += "&s=ranked"
                    } else {
                        uri += "?s=ranked"
                    }
                    break;
                case 'qualified':
                    if (uri.length >= 6) {
                        uri += "&s=qualified"
                    } else {
                        uri += "?s=qualified"
                    }
                    break;
                case 'loved':
                    if (uri.length >= 6) {
                        uri += "&s=loved"
                    } else {
                        uri += "?s=loved"
                    }
                    break;
                case 'pending':
                    if (uri.length >= 6) {
                        uri += "&s=pending"
                    } else {
                        uri += "?s=pending"
                    }
                    break;
                case 'graveyard':
                    if (uri.length >= 6) {
                        uri += "&s=graveyard"
                    } else {
                        uri += "?s=graveyard"
                    }
                    break;
                default:
                    break;
            }
            switch (vm.nsfw) {
                case 0:
                    break;
                case 1:
                    if (uri.length >= 6) {
                        uri += "&nsfw=1"
                    } else {
                        uri += "?nsfw=1"
                    }
                    break;
                default:
                    break;
            }
            switch (vm.extra) {
                case "":
                    break;
                case "video":
                    if (uri.length >= 6) {
                        uri += "&e=video"
                    } else {
                        uri += "?e=video"
                    }
                    break;
                case "storyboard":
                    if (uri.length >= 6) {
                        uri += "&e=storyboard"
                    } else {
                        uri += "?e=storyboard"
                    }
                    break;
                case "storyboard.video":
                    if (uri.length >= 6) {
                        uri += "&e=storyboard.video"
                    } else {
                        uri += "?e=storyboard.video"
                    }
                    break;
                default:
                    break;
            }
            switch (vm.sort) {
                case "":
                    break;
                case "title_desc":
                    if (uri.length >= 6) {
                        uri += "&sort=title_desc"
                    } else {
                        uri += "?sort=title_desc"
                    }
                    break;
                case "title_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=title_asc"
                    } else {
                        uri += "?sort=title_asc"
                    }
                    break;
                case "artist_desc":
                    if (uri.length >= 6) {
                        uri += "&sort=artist_desc"
                    } else {
                        uri += "?sort=artist_desc"
                    }
                    break;
                case "artist_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=artist_asc"
                    } else {
                        uri += "?sort=artist_asc"
                    }
                    break;
                case "difficulty_desc":
                    if (uri.length >= 6) {
                        uri += "&sort=difficulty_desc"
                    } else {
                        uri += "?sort=difficulty_desc"
                    }
                    break;
                case "difficulty_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=difficulty_asc"
                    } else {
                        uri += "?sort=difficulty_asc"
                    }
                    break;
                case "ranked_desc":
                    break;
                case "ranked_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=ranked_asc"
                    } else {
                        uri += "?sort=ranked_asc"
                    }
                    break;
                case "favourites_desc":
                    if (uri.length >= 6) {
                        uri += "&sort=favourites_desc"
                    } else {
                        uri += "?sort=favourites_desc"
                    }
                    break;
                case "favourites_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=favourites_asc"
                    } else {
                        uri += "?sort=favourites_asc"
                    }
                    break;
                case "updated_desc":
                    if (uri.length >= 6) {
                        uri += "&sort=updated_desc"
                    } else {
                        uri += "?sort=updated_desc"
                    }
                    break;
                case "updated_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=updated_asc"
                    } else {
                        uri += "?sort=updated_asc"
                    }
                    break;
                case "plays_desc":
                    if (uri.length >= 6) {
                        uri += "&sort=plays_desc"
                    } else {
                        uri += "?sort=plays_desc"
                    }
                    break;
                case "plays_asc":
                    if (uri.length >= 6) {
                        uri += "&sort=plays_asc"
                    } else {
                        uri += "?sort=plays_asc"
                    }
                    break;
                default:
                    break;
            }
            switch (vm.creatorid) {
                case 0:
                    break;
                default:
                    if (uri.length >= 6) {
                        uri += "&creator=" + vm.creatorid
                    } else {
                        uri += "?creator=" + vm.creatorid
                    }
                    break;
            }
            switch (vm.search_query) {
                case "":
                    break;
                default:
                    if (uri.length >= 6) {
                        uri += "&q=" + vm.search_query
                    } else {
                        uri += "?q=" + vm.search_query
                    }
                    break;
            }
            window.history.replaceState("", document.title, uri);
        },
        changeoffset: function (page = 0) {
            var vm = this;
            this.page = page;
            this.offset = 0;
            if (vm.list.length >= (48 * vm.page)) {
                vm.getBeatmapData();
            }
        },
        searchQueryConvert(q) {
            if (q.length >= 1) {
                return this.search_query;
            }
            return q
        },
        getBeatmapData: function () {
            var vm = this;
            vm.load = true;
            vm.fullscreenLoading = true;
            vm.generateHref();
            var querys = vm.searchQueryConvert(vm.search_query);
            this.$axios.get("https://api.nerina.pw/search", {
                params: {
                    m: this.mode,
                    p: this.page,
                    s: this.rank,
                    nsfw: this.nsfw,
                    e: this.extra,
                    q: querys,
                    sort: this.sort,
                    creator: this.creatorid
                }
            })
            .then(function (response) {
                if (vm.list.length < 1) {
                    vm.list = response.data;
                } else {
                    for (bms in response.data) {
                        vm.list.push(response.data[bms]);
                    }
                }
                vm.load = false;
                vm.first_load = false;
                this.fullscreenLoading = false;
                vm.temp_list = response.data
            })
            .catch(error => {
                vm.load = false;
                vm.first_load = false;
                this.fullscreenLoading = false;
                if (vm.list.length >= 48) {
                    vm.list = vm.list;
                } else {
                    vm.list = []
                }
            });
        },
        chageSearch_Query() {
            var vm = this;
            vm.offset = 0;
            vm.getBeatmapData();
        }
    }
});