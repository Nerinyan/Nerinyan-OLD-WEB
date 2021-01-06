Vue.mixin({
    methods: {
        weightedPP(page, idx, pp){
            var perc = Math.pow(0.95, ((page - 1) * 20) + idx);
            var wpp = pp * perc;
            return wpp.toFixed(2);
        },
        weightedPPpercent(page, idx, pp){
            var perc = Math.pow(0.95, ((page - 1) * 20) + idx);
            return Math.round(perc*100);
        },
        weightedPPv1(page, idx, pp){
            if (idx == 0) {
                return "Weighted 100% (" + pp + "pp)";
            }

            var perc = Math.pow(0.95, ((page - 1) * 20) + idx);
            var wpp = pp * perc;
            return "Weighted " + Math.round(perc*100) + "% (" + wpp.toFixed(2) + "pp)";
        },
        initBoxes(){
            $(".box-header").click(function()
            {
                let active = $(this).hasClass('active');
                if(!active) $(this).addClass('active');
                else $(this).removeClass('active');
                var spoiler=$(this).parents(".userpage-box")[0];
                $(spoiler).children(".box-content").slideToggle("fast");
            });
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
        timeDifference: function(date1, date2) {
            if (typeof date1 == "object"){
                date1 = date1.getTime()/1000;
            }
            //var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            var seconds = Math.floor(date1 - date2);
            var interval = Math.floor(seconds / 31536000);

            if (interval == 1) return "1 year";
            if (interval > 1) return interval + " years"
               
            interval = Math.floor(seconds / 2592000);
            if (interval == 1) return "1 month";
            if (interval > 1) return interval + " months";
                
                
            interval = Math.floor(seconds / 86400);
            if (interval == 1) return "1 day";
            if (interval > 1) return interval + " days";
            
            interval = Math.floor(seconds / 3600);
            if (interval == 1) return "1 hour";
            if (interval > 1) return interval + " hours";
                
            interval = Math.floor(seconds / 60);
            if (interval == 1) return "1 minute";
            if (interval > 0) return interval+" minutes";

            if (Math.floor(seconds) == 1) return "1 second";
            return Math.floor(seconds) + " seconds";
            
        },
        timeSince: function(date) {
            if (typeof date == "object"){
                date = date.getTime()/1000;
            }
            var now = new Date();
            //var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            var currentTime = now / 1000;
            var seconds = Math.floor(currentTime - date);
        
            var interval = Math.floor(seconds / 31536000);
        
            if (interval > 1) {
                return interval + " years ago";
            }if (interval == 1){
                return "about a year ago";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) { 
                return interval + " months ago";
            }if (interval == 1){
                return "about a month ago";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days ago";
            }if (interval == 1){
                 interval = Math.floor(seconds / 3600);
                return "about " + interval + " hours ago";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return "about " + interval + " hours ago";
            }if (interval == 1){
                return "about a hour ago";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return "about " + interval + " minutes ago";
            }if (interval == 1){
                return "about a minute ago";
            }
            if (seconds < 0){
                console.log(date, currentTime);
            }
            return "about " + Math.floor(seconds) + " seconds ago";
        },
        unixToTime(t){
            var date = new Date(t*1000);
            var year = date.getFullYear();
            var month = "0" + (date.getMonth()+1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2) + " (UTC+9)";
        },
        getScoreMods(m, plus=true){
            var r = '';
            var hasNightcore = false, hasPF = false;
            if (m & NoFail) {
                r += 'NF';
            }
            if (m & Easy) {
                r += 'EZ';
            }
            if (m & NoVideo) {
                r += 'TD';
            }
            if (m & Hidden) {
                r += 'HD';
            }
            if (m & Nightcore) {
                r += 'NC';
                hasNightcore = true;
            }
            if (!hasNightcore && (m & DoubleTime)) {
                r += 'DT';
            }
            if (m & HardRock) {
                r += 'HR';
            }
            if (m & Perfect) {
                r += 'PF';
                hasPF = true;
            }
            if (m & Relax) {
                r += 'RX';
            }
            if (m & HalfTime) {
                r += 'HT';
            }
            if (m & Flashlight) {
                r += 'FL';
            }
            if (m & Autoplay) {
                r += 'AP';
            }
            if (m & SpunOut) {
                r += 'SO';
            }
            if (m & Relax2) {
                r += 'AP';
            }
            if (!hasPF && (m & SuddenDeath)) {
                r += 'SD';
            }
            if (m & Key4) {
                r += '4K';
            }
            if (m & Key5) {
                r += '5K';
            }
            if (m & Key6) {
                r += '6K';
            }
            if (m & Key7) {
                r += '7K';
            }
            if (m & Key8) {
                r += '8K';
            }
            if (m & keyMod) {
                r += '';
            }
            if (m & FadeIn) {
                r += 'FD';
            }
            if (m & Random) {
                r += 'RD';
            }
            if (m & LastMod) {
                r += 'CN';
            }
            if (m & Key9) {
                r += '9K';
            }
            if (m & Key10) {
                r += '10K';
            }
            if (m & Key1) {
                r += '1K';
            }
            if (m & Key3) {
                r += '3K';
            }
            if (m & Key2) {
                r += '2K';
            }
            if (m & SCOREV2) {
                r += 'V2';
            }
            if (r.length > 0) {
                if (!plus) return r
                return "+ "+r;

            } else {
                return '';
            }
        },
        getScoreModsTest(m, plus=false){
            var blocks = document.getElementById('mods-block');

            var r = new Array();
            var hasNightcore = false, hasPF = false;
            if (m & NoFail) {
                r.push('NF');
            }
            if (m & Easy) {
                r.push('EZ');
            }
            if (m & NoVideo) {
                r.push('TD');
            }
            if (m & Nightcore) {
                r.push('NC');
                hasNightcore = true;
            }
            if (!hasNightcore && (m & DoubleTime)) {
                r.push('DT');
            }
            if (m & Hidden) {
                r.push('HD');
            }
            if (m & HardRock) {
                r.push('HR');
            }
            if (m & Perfect) {
                r.push('PF');
                hasPF = true;
            }
            if (m & Relax) {
                r.push('RX');
            }
            if (m & HalfTime) {
                r.push('HT');
            }
            if (m & Flashlight) {
                r.push('FL');
            }
            if (m & Autoplay) {
                r.push('AUTO');
            }
            if (m & SpunOut) {
                r.push('SO');
            }
            if (m & Relax2) {
                r.push('AP');
            }
            if (!hasPF && (m & SuddenDeath)) {
                r.push('SD');
            }
            if (m & Key4) {
                r.push('K4');
            }
            if (m & Key5) {
                r.push('K5');
            }
            if (m & Key6) {
                r.push('K6');
            }
            if (m & Key7) {
                r.push('K7');
            }
            if (m & Key8) {
                r.push('K8');
            }
            if (m & keyMod) {
                r += '';
            }
            if (m & FadeIn) {
                r.push('FD');
            }
            if (m & Random) {
                r.push('RANDOM');
            }
            if (m & LastMod) {
                r.push('CN');
            }
            if (m & Key9) {
                r.push('K9');
            }
            if (m & Key10) {
                r.push('K10');
            }
            if (m & Key1) {
                r.push('K1');
            }
            if (m & Key3) {
                r.push('K3');
            }
            if (m & Key2) {
                r.push('K2');
            }
            if (m & SCOREV2) {
                r.push('V2');
            }
            return r;
        },
        convertMode(mode){
            var result;
            switch(mode){
                default:
                case "osu":
                    result = 0;
                    break;
                case "taiko":
                    result = 1;
                    break;
                case "ctb":
                    result = 2;
                    break;
                case "mania":
                    result = 3;
                    break;
            }
            return result;
        },
        convertModeToTextFull(mode){
            var result;
            switch(mode){
                default:
                case 0:
                    result = "osu!";
                    break;
                case 1:
                    result = "Taiko";
                    break;
                case 2:
                    result = "Catch The Beat";
                    break;
                case 3:
                    result = "osu!mania";
                    break;
            }
            return result; 
        },
        convertModeToText(mode){
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
                    result = "ctb";
                    break;
                case 3:
                    result = "mania";
                    break;
            }
            return result; 
        },
        convertMode2Text(mode){
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
        convertModsToFull(mods) {
            var result;
            switch(mods){
                default:
                case 'HD':
                    result = "Hidden"
                    break;
                case 'NF':
                    result = "No Fail"
                    break;
                case 'DT':
                    result = "Double Time"
                    break;
                case 'NC':
                    result = "Night Core"
                    break;
                case 'EZ':
                    result = "Easy"
                    break;
                case 'HR':
                    result = "Hard Rock"
                    break;
                case 'PF':
                    result = "Perfect"
                    break;
                case 'RX':
                    result = "Relax"
                    break;
                case 'HT':
                    result = "Half Time"
                    break;
                case 'FL':
                    result = "Flashlight"
                    break;
                case 'AUTO':
                    result = "Autoplay"
                    break;
                case 'SO':
                    result = "Spun Out"
                    break;
                case 'AP':
                    result = "AutoPliot"
                    break;
                case 'SD':
                    result = "Sudden Death"
                    break;
                case 'K4':
                    result = "4 Keys"
                    break;
                case 'K5':
                    result = "5 Keys"
                    break;
                case 'K6':
                    result = "6 Keys"
                    break;
                case 'K7':
                    result = "7 Keys"
                    break;
                case 'K8':
                    result = "8 Keys"
                    break;
                case 'K9':
                    result = "9 Keys"
                    break;
                case 'K10':
                    result = "10 Keys"
                    break;
                case 'K1':
                    result = "1 Keys"
                    break;
                case 'K2':
                    result = "2 Keys"
                    break;
                case 'K3':
                    result = "3 Keys"
                    break;
                case 'V2':
                    result = "Score V2"
                    break;
                case 'RANDOM':
                    result = "Random"
                    break;
                case 'FD':
                    result = "Fade In"
                    break;
            }
            return result; 
        },
        calculateAccuracy(c300, c100, c50, cMiss){
            var totalPoints = c50*50+c100*100+c300*300
			var totalHits = c300+c100+c50+cMiss
            var accuracy = totalPoints/(totalHits*300);
            return (accuracy * 100).toFixed(2);
        },
        secondsToTime(time){
            
            var hrs = ~~(time / 3600);
            var mins = ~~((time % 3600) / 60);
            var secs = ~~time % 60;
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        }
    }
});


var NoFail = 1;
var Easy = 2;
var NoVideo = 4;
var Hidden = 8;
var HardRock = 16;
var SuddenDeath = 32;
var DoubleTime = 64;
var Relax = 128;
var HalfTime = 256;
var Nightcore = 512;
var Flashlight = 1024;
var Autoplay = 2048;
var SpunOut = 4096;
var Relax2 = 8192;
var Perfect = 16384;
var Key4 = 32768;
var Key5 = 65536;
var Key6 = 131072;
var Key7 = 262144;
var Key8 = 524288;
var keyMod = 1015808;
var FadeIn = 1048576;
var Random = 2097152;
var LastMod = 4194304;
var Key9 = 16777216;
var Key10 = 33554432;
var Key1 = 67108864;
var Key3 = 134217728;
var Key2 = 268435456;
var SCOREV2 = 536870912;