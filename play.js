var Player = {
    toQueue:function(param, type){
        // Close Context Menu
        
        $(".context_menu_mobile").remove()
        
        // Song Meta
        var songname = $(param).find(".s_playname").text();
        var artistname = $(param).find(".a_playname").text();

        // Get Container
        var container = $(param)[0].parentNode.parentNode.className;

        // Emtpy Queue if played from Album
        var imi_ = function(){ 
            // if(type =="album_playlists"){
            if( container == "album_trcks_cont" || container == "popular_songs_cont"){
                var item_index = parseInt($(param).attr("title"));
    
                // Get Tracks
                var tracks_= ( container =="popular_songs_cont" )? Object.values($(".popular_songs_cont").find(".albmtrack_item_open")) : Object.values($(".album_trcks_cont").find(".albmtrack_item_open"));
                var tracks__lngth = ( container == "popular_songs_cont" )? $(".popular_songs_cont").find(".albmtrack_item_open").length :
                $(".album_trcks_cont").find(".albmtrack_item_open").length;
                tracks_.length = tracks__lngth;
    
                // Tracks to be Removed
                var num_of_tracks2rmv = item_index;

                var prev_songs = tracks_.splice( 0, num_of_tracks2rmv );
                
                // Empty Queue
                State.q_ = [];
    
                // Append Song to bottom of Queue
                tracks_.push.apply(tracks_, prev_songs);
                
                // Map thru tracks
                tracks_.map(function(song,indx_){
    
                    // Get name & osng for DB query
                    var song_n = $(song).find(".s_playname").text();
                    var song_a = $(song).find(".a_playname").text();
    
                    // Query DB
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(song_n).endAt(song_n+"\uf8ff").once("child_added", function(snap){
                        // Match exact songartist
                        if(song_a == snap.child("artist").val()){
                            var song = snap.val();
                            
                            // Push to Queue
                            State.q_.unshift({
                                songTitle: song.songTitle,
                                artist: song.artist,
                                songID: snap.key,
                                artwork:song.image,
                                iframe: song.iframe
                            })

                            // Play Song
                            setTimeout(function(){Player.play()}, 1000)
                        }
                    })
                })
            }
            else{
                // if song is already in playlist
                State.q_.map(function(song, index){
                    if(songname == song.songTitle){
                        State.q_.splice(index, 1)
                    }
                })
        
                // Query DB
                firebase.database().ref("songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("child_added", function(snap){
                    // Match exact songartist
                    if(artistname == snap.child("artist").val()){
                        var song = snap.val();
                        var p1_ = State.q_[0];
                        
                        // Move to Current 1st to Last FIFO
                        ( State.q_.length > 1)? ( State.q_.shift(), State.q_.push(p1_) ):null;
        
                        // Push to Queue
                        State.q_.unshift({
                            songTitle: song.songTitle,
                            artist: song.artist,
                            songID: snap.key,
                            artwork:song.image,
                            iframe: song.iframe
                        })
        
                        // Play Song
                        setTimeout(function(){Player.play()}, 1000)
                    }
                })
            }
        }

        imi_()
    },
    play:function(){ 
        // Show Spinner for 3secs
        $(".app_body_").append(`<div class="spinnerContainer_"><div class="mk-spinner-centered mk-spinner-ring"></div></div>`);

        // Remove spinner when song playing
        var remove_spin = setInterval(function(){
            if($(".audioElement")[0].currentTime > 0){
                clearInterval(remove_spin)
                $(".spinnerContainer_").remove()  
            }  
        }, 100)

        // Get song URL
        var s = State.q_[0];
        var l = m_.storage().ref().child("songsAll/" + s.iframe);
        l.getDownloadURL().then(function (u) {
            
            // Add URL to audio source
            $(".audioElement")[0].src = null;
            $(".audioElement")[0].src = u;
            
            // Play song
            Player.controls("play")
            
            // Count Stream once play init
            var c_ = setInterval(function(){
                if( $(".audioElement")[0].currentTime >= 15){
                    // clear interval and count
                    clearInterval(c_)
                    Player.countStream( State.q_[0].songTitle, State.q_[0].artist )
                }
            }, 10); 

            // Update Queue Widget if Open
            ( State.q_viewState == true)? queue.open():null;
            
            // Meta Operations
            Player.meta_ops()
        });
    },
    pause:function(){

    },
    next:function(){
        // q length
        var s_ = State.q_.length;
        var s = State.q_;
        
        // If 1songs
        if( s_ == 1 ){
            // Repeat song at position 1
            Player.play()
        }
        
        // More than 1
        else if( s_ >1){
            // unshift index 0 to end of array
            var s1 = s[0];
            State.q_.shift();
            State.q_.push(s1)

            // Then Play
            Player.play()
        }
        
        // if 0
        else if(0){
            return
        }
    },
    prev:function(){
        // q length
        var s_ = State.q_.length;
        var s = State.q_;
        
        // If 1song
        if( s_ == 1 ){
            // Repeat song at position 1
            Player.play()
        }
        
        // More than 1
        else if( s_ >1){
            // unshift last index to 1st position
            var s1 = s[ s_ - 1 ];
            State.q_.pop();
            State.q_.unshift(s1)

            // Then Play
            Player.play()
        }
        
        // if 0
        else if(0){
            return
        }
    },
    countStream:function(songName, artist_){
        firebase.database().ref("songs").orderByChild("songTitle").startAt(songName).endAt(songName+"\uf8ff").once("child_added", function(snap){
            // Match artist b4 proceed
            if( artist_ == snap.child("artist").val()){
                // Get Data
                var streams = snap.child("streamCount").val() + 1;
                var key = snap.key;
                var newref = {
                    artist: snap.val().artist,
                    iframe: snap.val().iframe,
                    image: snap.val().image,
                    songTitle: snap.val().songTitle,
                    streamCount: streams,
                    timeStamp:snap.val().timeStamp,
                }
                // Update Ref with New Count
                firebase.database().ref( "songs/" + key ).update( newref )
            }
        })
    },
    meta_ops:function(){
        // Await song to start play
        var sp_ = setInterval(function(){if($(".audioElement")[0].currentTime >0){    clearInterval(sp_), procd_()}}, 10);
        
        // Proceed after song start
        var procd_ = function(){

            // Change MetaData
            var a_ = State.q_[0].artwork;     var st_ = State.q_[0].songTitle;        var ar_ = State.q_[0].artist;
            $(".meta_src_pc").attr("src", a_);         $(".songName_meta").text(st_);                       $(".artistName_meta").text(ar_);
            
            (  $(".App_Root").find(".img_toggle_cont").length > 0 ) ? $(".toggle_songimg_").attr("src", a_): null; 

            // Update Duration
            var d_ = Player.d($(".audioElement")[0].duration)
            $(".duration_time").text(d_)          

            // Change Controls || Buttons ||
            var q = setInterval(function () {
                // Update Slider
                Player.slider(q);
                // Update time
                Player.t_changer();
            }, 1000); 
        }
    },
    slider:function (z) {
        // Get audio Element
        var x_new = $(".audioElement")[0];
        var width_incr = Math.ceil((x_new.currentTime / x_new.duration) * 100) + "%";
        
        // Update duration Bar
        $(".duration_slider").css("width", width_incr);

        // Update Slider Dot
        ($(".sliderDot").length > 0)? $(".sliderDot").css("left", $("#duration_bar")[0].offsetWidth * (x_new.currentTime / x_new.duration) ) : null;
        
        // When SongEnd
        Player.songEnded(z);
    },
    songEnded: function(a){
        var currT = $(".audioElement")[0].currentTime;
        var currD = $(".audioElement")[0].duration;
        if (currT == currD) {
            clearInterval(a);
            // Change Controls
            Player.controls("pause");
            // Remove Song From Elemnt
            $(".audioElement").attr("src","null")
            // Continuos Play
            if(State.q_.length >1){
                setTimeout(function(){
                    Player.controls("next")
                },2000)
            }
        }
    },
    t_changer: function() {
        var CT_raw = $(".audioElement")[0].currentTime;
        // i. Check if track has started and if not keep checking then Update Duration Meta
        var duChecker = setInterval(function(){
          if (CT_raw != 0) {
            clearInterval(duChecker);
            var time = CT_raw / 60;
            var minutes = Math.floor(time);
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            var secr = time - minutes;
            var sec = Math.ceil(secr * 60);
            if (sec < 10) {
              sec = "0" + sec;
            }
            var current_time = minutes + ":" + sec;
            $(".crnt_time").text(current_time);
          }
        });
    },
    controls:function(call_){
        // Message
        var call = ( $(call_).attr("title") != undefined)? $(call_).attr("title") : call_;
    
        // switch by call
        switch(call){
            case "play":
                return  $(".audioElement")[0].play(), $(".play").css("display", "none"), $(".pause").css("display", "block")
            case "pause":
                return $(".audioElement")[0].pause(), $(".play").css("display", "block"), $(".pause").css("display", "none")
            case "next":
                return Player.next()
            case "prev":
                return Player.prev()
        }
    },
    d:function(CT_raw){
        // Get Sec & Min
        var time = CT_raw / 60;     var minutes = Math.floor(time);
        // Min correction
        if (minutes < 10) {     minutes = "0" + minutes;    }
        // Sec 60
        var secr = time - minutes;      var sec = Math.ceil(secr * 60);
        // Sec Correction
        if (sec < 10) {     sec = "0" + sec;    }
        
        return  minutes + ":" + sec;
    },
    sld_mover:function() {
        $(".duration_bar").click(function (event) {

            // Parameters
            var CurrntSong_duration = $(".audioElement")[0].duration;
            var T = ( $(document)[0].body.clientWidth < 600) ? $(document)[0].body.clientWidth : parseInt($(".duration_bar").css("width"));
            var x = $(".duration_bar").offset().left;
            var y = event.pageX;
            var z = ((y - x) / T) * 100;
            var new_width = Math.ceil(Math.abs(z)) + "%";

            // Update Duration Bar
            $(".duration_slider").css("width", new_width);

            // Update Slider Dot
            $(".sliderDot").css("left", $("#duration_bar")[0].offsetWidth * (z/100) );

            // Convert width to time;
            var seek_value = (Math.abs(y - x) / T) * CurrntSong_duration;

            // Seek to Duration
            var set_currentTime =  function(){  $(".audioElement")[0].currentTime = seek_value };
            ( $(".audioElement").attr("src") != "null" )? set_currentTime() : null;

        });
    },
    open_latest_rls:function(param){
        // Get Type of object
        var type = $(param).attr("id");

        // Switch
        switch(type){
            case "album":
                return Pages.render_page( "album", param)
            case "song":
                return Player.toQueue(param)
        }
    },
    toggle_player:function(){

        // Get State of container
        var toggle_state = (  $(".App_Root").find(".toggle_container").length >= 1 )? true: false;

        // Remove if open
        if(  toggle_state == true  ){
            // Toggle regular duration bar
            $($(".duration_barcontainer")[1]).css("display", "block");
            $(".songName_meta").css("font-size","3vw")
            
            // Correct Play Pause
            if(   $(".audioElement")[0].paused == false  ){
                // Change Play icon
                $(".play").css("display", "none");     
                $(".pause").css("display", "block");
            }

            return $(".toggle_container").remove()
        }
        // Toggle open if closed
        else if(    toggle_state  == false   ){
            // Toggle regular duration bar
            $($(".duration_barcontainer")[1]).css("display", "none")

            // Markup
            var img_ = (  State.q_.length > 0  )? State.q_[0].artwork: "";
            var markup = this.toggle_mkup(img_)

            // Append 
            $(".App_Root").append(markup)

            // Get controls and time
            var songname = $(".songName_meta")[1].innerText;    var artist = $(".artistName_meta")[1].innerText;
            var durationBar = `<div class="duration_barcontainer duration_barcontainer_toggle"><div class="crnt_time crnt_time_toggle">0:00</div>
            <div id="duration_bar" class="duration_bar duration_bar_toggle" onclick="sk_()"><div class="duration_slider _duration_slider_"></div>
            <div id="sliderDot" class="sliderDot"></div></div><div class="duration_time duration_time_toggle">0:00</div></div>`;

            var controls = `<div class="media-controls media-controls_toggle"><img src="./assets/icons/prevv.png" class="prev iterators_" onclick="cnls(this)" title="prev">
            <img src="./assets/icon/play.png" class="play playpause" onclick="cnls(this)" title="play"><img src="./assets/icon/pause.png" class="pause playpause" onclick="cnls(this)" title="pause">
            <img src="./assets/icons/nextt.png" class="next iterators_" onclick="cnls(this)" title="next"></div>`;

            var meta = `<div class="metaText metaText_toggle"><div class="songName_meta">`+songname+`</div>
            <div class="artistName_meta artistName_meta_toggle">`+artist+`</div></div>`;
            
            // Append Controls and time
            $(".toggle_controls").append(durationBar).append(meta).append(controls);

            // Set Event listener for mobile duration bar seek
            Player.eventListeners()

            // Correct iterator CSS & PlyPause size
            $($(".songName_meta")[2]).css({"width":"unset", "font-size":"13px"})
            $(".iterators_").css({"top":"5.5vh", "height":"30px", "width":"35px"});   $($(".playpause")[0]).css({"height": "80px", "width":"80px"});
            $($(".playpause")[4]).css({"height": "80px", "width":"80px"});
            $($(".playpause")[5]).css({"height": "80px", "width":"80px"});

            // Correct Play Pause
            if(   $(".audioElement")[0].paused == false  ){
                // Change Play icon
                $(".play").toggle();     
                $(".pause").toggle();

                // Correct Artwork
                var a_ = State.q_[0].artwork;
                $(".toggle_songimg_").attr("src", a_);
            }
        }

    },
    toggle_mkup:function(img){
        var output = `
            <div class="toggle_container">
                <div class="close_toggle_cont_opn" >
                    <span class="close_toggle_opn" onclick="_tgl_plyr_()">
                        <svg class="close_toggle_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve" class="">
                        <g><g><g id="expand-more"><polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35   " data-original="#000000" class="active-path" data-old_color="#9F9E9E" fill="#A1A1A1"/>
                        </g></g></g></svg>
                    </span>
                    <span class="nowplaying_txt">Now Playing</span>
                </div>
                <div class="toggle_meta_cont">
                    <div class="img_toggle_cont"><img src="`+img+`" class="toggle_songimg_"></div>
                </div>
                <div class="toggle_controls"></div>
            </div>
        `;
        return output
    },
    eventListeners:function(){
        var move_event = ( $(document)[0].body.clientWidth < 768)? "touchmove":"mousemove";
        var mousedown_event = ( $(document)[0].body.clientWidth < 768)? "touchstart":"mousedown";

        // Mouse Down
        document.getElementById("sliderDot").addEventListener(mousedown_event, function(e){
            // Prevent Drag Effect showing
            e.preventDefault();
            // Update Object
            State.mouse_state.mouseup = false;

            // Set mouseup listener
            State.mouse_state.uplistener = setInterval(() => {
                // if mouseUp
                if(State.mouse_state.mouseup == true){
                    // Clear interval
                    clearInterval(State.mouse_state.uplistener);
                    // Remove event listeners
                    return $(document).off( move_event ), $(document).off( "mouseup")
                }
            }, 10);

            // Mouse Up by device type
            ( $(document)[0].body.clientWidth < 768)? 
            document.querySelector(".sliderDot").addEventListener("touchend", function(e_){State.mouse_state.mouseup = true}) : document.querySelector(".sliderDot").addEventListener("mouseup", function(e_){State.mouse_state.mouseup = true});

            document.querySelector(".sliderDot").addEventListener(move_event, function(e_){
                // X  value
                var x = ($(document)[0].body.clientWidth < 768)? e_.changedTouches[0].clientX: e_.pageX;

                // Convert 
                var left_ = x - $("#duration_bar").offset().left;
                var width_ = Math.floor((left_/$("#duration_bar")[0].offsetWidth)*100);

                // Change slider width
                Player.changesliderWidth(left_, width_);
                
            })
        })   
    },
    changesliderWidth: function(left_, width_){
        var sliderEndXcord = $("#duration_bar")[0].offsetWidth;

        left_ = ( left_ < 0)? 0: ( left_ > sliderEndXcord) ? sliderEndXcord : left_;
        width_ = ( width_ < 0)? 0: ( width_ > 100) ? 100 : width_;
        var newTime = (width_/100)*$(".audioElement")[0].duration;

        // Move left position of Dot
        $(".sliderDot").css("left", left_-3);

        // Change Slider Width
        $(".duration_slider").css("width", `${width_}%`);

        // Change Song Time
        (   $(".audioElement").attr("src") != "null" )? ( $(".audioElement")[0].currentTime = newTime ): null;
    }
}

var p_ = function(param){
    $(".audioElement")[0].src = null;
    $(".audioElement")[0].src = "/blank";
    $(".audioElement")[0].play()
    return Player.toQueue(param, "album_playlists")
}
var _p_ = function(param){
    $(".audioElement")[0].src = null;
    $(".audioElement")[0].src = "/blank";
    $(".audioElement")[0].play()

    return Player.toQueue(param, "single")
}
var _p_m = function(){ 

    $(".audioElement")[0].src = null;
    $(".audioElement")[0].src = "/blank";
    $(".audioElement")[0].play()

    return Player.toQueue(State.contToPlay, "single")
}
var cnls = function(param){
    return Player.controls(param)
}
var sk_ = function(){
    return Player.sld_mover()
}
var nw_rls = function(param){
    return Player.open_latest_rls(param)
}
var _tgl_plyr_ = function(){
    return Player.toggle_player()
}