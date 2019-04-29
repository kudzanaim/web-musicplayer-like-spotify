

var context = {
    exe:function(e, type){

        // Get Parent
        var SongObject = $(e)[0].parentElement;
        State.songToplay = SongObject;
        
        // Get mouse Position
        var pos_x = State.mouse.x + 30; var pos_y = State.mouse.y + 5;
        
        // Open Menu
        this.open(pos_x, pos_y, type)

    },
    open:function(pos_x, pos_y, type){
        // Remove Menu Instances in DOM
        $(".context_menu").remove();
        $(".context_menu_mobile").remove();

        // Append Container to Body
        var menu = this.markup(type);
        $(".App_Root").append(menu)

        // Correct Position if far left
        var left_ = (State.mouse.x <= 750)  ? State.mouse.x + 182 :  State.mouse.x - 170 ;
        var top_ = (State.mouse.y <= 200)  ? State.mouse.y : State.mouse.y - 150 ;

        // Change position of Menu
        ( type == "playlist" || type == "static") ? $(".context_menu").css({"top":top_, "left":left_}) : $(".context_menu").css({"top":pos_y-100, "left":pos_x});

        // Set Menu Event Listeners
        context.menu_mouseover()

        // Toggle
        $(".context_menu").css("display","block")
       

    },
    markup:function(type){
        var static = `
            <div class="context_menu">
                <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                <div class="line_menu_cxt"></div>
                <span class="cxt_menu_item" onclick="slctor()">Add to Playlist</span>
                <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
            </div>
        `;
        var static_mobile = `
            <div class="context_menu_mobile">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;

        
        var playlist = `
            <div class="context_menu context_menu_">
                <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                <div class="line_menu_cxt"></div>
                <span class="cxt_menu_item" onclick="slctor_()">Add to Playlist</span>
                <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                <span class="cxt_menu_item" onclick="del(this)">Delete</span>
            </div>
        `;
        var playlist_mobile = `
            <div class="context_menu_mobile context_menu_">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor_()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="cxt_menu_item" onclick="del(this)">Delete</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;
        var latest_mobile = `
            <div class="context_menu_mobile context_menu_">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="_p_m()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor_()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="cxt_menu_item" onclick="del(this)">Delete</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;

        // Responsive Settings
        static = ( $(document)[0].body.clientWidth < 600)? static_mobile : static;
        playlist = ( $(document)[0].body.clientWidth < 600)? playlist_mobile : playlist;

        switch(type){
            case "album":
                return static
            case "playlist":
                return playlist
            case "static":
                return static
            case "home":
                return static
            case "latest":
                return latest_mobile
        }
    },
    rmv:function(){
        return $(window).mousedown(function(e){
            // Detect Left Button Click
            if(e.button == 1 || e.button == 0){

                // Get id
                var id = ( e.target.className == "_song_options_" ) ? $($(e.target)[0].parentElement).attr("id") : $(e.target)[0].id ;

                var type = (id == "opts_" || id == "opts") ? "play_stat" : "home";

                // Get mouse pos
                State.mouse = {
                    x: e.clientX,
                    y: e.clientY,
                    type:type
                }
                // Remove Menu
                $(".context_menu").remove()
                $("._pl_slctor_").remove()
            }
        })
    },
    menu_mouseover:function(){
        // Disbale Mousedown on Mouse over Menu
        return $(".context_menu")[0].addEventListener( "mouseover",function(e){
            $(window).off("mousedown")
        }),

        // Enable Mousedown on MouseOut
        $(".context_menu")[0].addEventListener("mouseout", function(e){
            $(window).off("mousedown")
            context.rmv()
        })
    },
    play_sng: function(){
        return Player.toQueue(State.songToplay), $(".context_menu").remove()
    },
    a_t_pl:function(e){

        // Close Containers
        $(".context_menu").remove()
        $(".context_menu_mobile").remove()
        $("._pl_slctor_").remove()

        // Get Song
        var SongObject = State.songToplay;      var playlist = $(e).text()
        var song = $(SongObject).find(".s_playname").text();      var artist = $(SongObject).find(".a_playname").text(); 

        // Push to DB Playlist
        m_.database().ref("Users/"+State.usr_.ky+"/playlists").orderByChild("playlistName").startAt(playlist).endAt(playlist+"\uf8ff").once("child_added", function(snap){
            // Get pl Key
            var plkey = snap.key;
            // Get Song
            firebase.database().ref("songs").orderByChild("songTitle").startAt(song).endAt(song+"\uf8ff").once("child_added", function(snap_){
                if(artist == snap_.child("artist").val()){
                    // Song to Push
                    var song_2_push = snap_.val();
                    // Push to DB
                    m_.database().ref("Users/"+State.usr_.ky+"/playlists/"+plkey+"/songs").push(song_2_push).then(function(){
                        m_.database().ref("Users/"+State.usr_.ky+"/playlists").once("value", function(snapshot){
                            State.usr_.playlists = snapshot.val();
                        })
                    })
                }
            })

        })
    },
    pl_selctr:function(type){

        // if logged in
        var lgn_status = State.lgn_sts;
        
        if(lgn_status == false){
            // Close Context
            $(".context_menu_mobile").remove();

            // If mobile or desktop
            var prompt_ = this.prompt_();
            ( $(document)[0].body.clientWidth < 600)? $(".App_Root").append(prompt_) : Lib.alert();
            
        }
        else if(lgn_status == true){
            // if mobile then close context menu
            ( $(document)[0].body.clientWidth < 600)? $(".context_menu_mobile").remove() : null;
    
            // Selector Container
            var Container = `<div class="_pl_slctor_"><h1 class="pl_slctor_hdr">Select Playlist</h1>
            <div class="pl_slctor_cont"></div><button class="selctr_clse_mob" onclick="close_mnu()">Close</button></div>`;
            
            // Append Container                     
            $(".App_Root").append(Container);  
    
            // If click on far left
            var left_ = (State.mouse.x <= 750)  ? State.mouse.x + 182 :  $(".context_menu")[0].offsetLeft - 251 ;
            var top_ = (State.mouse.y <= 350)  ? State.mouse.y-50 : State.mouse.y - 300 ;
            var top_stat = State.mouse.y - 250;
    
            // if mobile not use left//top fixes
            function not_set(){    left_ = 0;  top_ = `17.1%`;   top_stat = `17.1%`;    }; 
            ( $(document)[0].body.clientWidth < 600)? not_set() : null;
    
            // Change Position
            ( State.mouse.type == "playlist" || State.mouse.type == "play_stat") ? $("._pl_slctor_").css({ "left":left_, "top": top_ }) : $("._pl_slctor_").css({"left":left_, "top":top_stat});
    
            // Map thru Playlists anmd Append to Dom
            Object.values(State.usr_.playlists).map(function(playlist, index){
                if(playlist.playlistName != undefined){
                    var pl_item = `<div class="_plslctor_item" onclick="a2pl(this)">`+playlist.playlistName+`</div>`;
                    $(".pl_slctor_cont").append(pl_item);
                }
            })
    
            // Deactivate listener
            context.selctr_mouse()
        }
        
    },
    selctr_mouse:function(){
        // Disbale Mousedown on Mouse over Menu
        return $("._pl_slctor_")[0].addEventListener( "mouseover",function(e){
            $(window).off("mousedown")
        }),

        // Enable Mousedown on MouseOut
        $("._pl_slctor_")[0].addEventListener("mouseout", function(e){
            $(window).off("mousedown")
            context.rmv()
        })
    },
    delete:function(){
        // Get song to Delete
        var song_ = State.songToplay;   var pl = State.open_pl.name; var k = State.open_pl.k;   var count = 0;
        var songname = $(song_).find(".s_playname").text();     var artist = $(song_).find(".a_playname").text();
        
        // Get Somgs Key
        m_.database().ref("Users/"+State.usr_.ky+"/playlists/"+k+"/songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("child_added", function(snap){
            if( artist == snap.child("artist").val()){
                var key = snap.key;

                // Delete Song
                m_.database().ref("Users/"+State.usr_.ky+"/playlists/"+k+"/songs/"+key).remove()

                // Remove Menu
                $(".context_menu").remove()
                $(".context_menu_mobile").remove()
                $("._pl_slctor_").remove()
                $(State.songToplay).remove();

                // Remove deleted Song
                $(song_).remove()
                
            }
        })
    },
    to_q:function(){
        // Song 
        var song_ = State.songToplay
        var songname = $(song_).find(".s_playname").text();     var artist = $(song_).find(".a_playname").text();

        // Get Song from DB
        firebase.database().ref("songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("child_added", function(snap){
            if( artist == snap.child("artist").val()){
                // Song Object
                var song = snap.val();
                                
                // Push to Queue
                State.q_.push({
                    songTitle: song.songTitle,
                    artist: song.artist,
                    songID: snap.key,
                    artwork:song.image,
                    iframe: song.iframe
                })

                // Re-render Q funct
                var r_rnd_q = function(){
                    // Get Tracks and Map
                    $(".q_cnt_main").html("")
                    State.q_.map(function(song, indx){
                        var track = queue.track_mkup(song.songTitle, song.artist);
                        $(".q_cnt_main").append(track)
                    })
                }
    
                // If Queue Open then Re-Render
                ( $(".app_body_").hasClass(".q_cont_sngs") == true ) ? r_rnd_q() : null;

                // Remove Menu
                $(".context_menu").remove()
                $(".context_menu_mobile").remove()
                $("._pl_slctor_").remove()
            }
        })
    },
    cls_menu:function(){
        return $(".context_menu_mobile").remove(), $("._pl_slctor_").remove()
    },
    prompt_:function(){
        var output = `
            <div class="prompt_container">
                <div class="_prompt_">
                    <div class="promptmessage">Seems you're not "Signed-In". Please sign-in or register an account in-orderto access your library</div>
                    <button class="close_prompt" onclick="cls_prompt()">Close</button>
                    <div class="prompt_btn_cont">
                        <button class="signin_btn_prompt" onclick="lgn()">Sign In</button>
                        <button class="register_btn_prompt" onclick="sgnup()">Register Account</button>
                    </div>
                </div>
            </div>
        `;
        return output
    }, 
    close_prompt: function(){
        return $(".prompt_container").remove()
    }

}

// cls [prompt]
var cls_prompt = function(){
    return context.close_prompt()
}
// Options_stat
var opts = function(e){
    return context.exe(e, "static") 
}
// Options_stat
var opts_ = function(e){
    return context.exe(e, "playlist")
}
// Options_stat
var _opts_ = function(e){
    return context.exe(e, "home")
}
// Options_stat on Latest Music
var _opts_m = function(e){
    State.contToPlay = $(e).find(".latest_itm_cont");
    e = $(e).find(".latest_itm_cont")[0];
    return context.exe(e, "latest")
}
// ply btn
var ply_mnu = function(){
    return context.play_sng()
}
// open selctor
var slctor = function(e){
    return context.pl_selctr()
}
// open selctor
var slctor_ = function(){
    return context.pl_selctr("playlist")
}
// sdd2pl
var a2pl = function(e){
    return context.a_t_pl(e)
}
// del
var del = function(e){
    return context.delete()
}
var to_qu_ = function(){
    return context.to_q()
}
var close_mnu = function(){
    return context.cls_menu()
}