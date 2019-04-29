var Home_ = {
    render:function(){
        // Close search if Open
        $(".resultsContainer").remove();
        $(".search_bar").val("");
        $(".cls_src_btn").remove()

        // Screen Notification
        int_.screenCheck();
        
        // Get markup
        var markup = this.markup();

        // Render Page Container
        $(".app_body_").html(markup)

        // Render Playlists
        this.do_playlists();

        // Render tracks
        this.doTracks();

        // Popular Artists
        ( $(document)[0].body.clientWidth < 600 ) ? this.do_artists() : null;

        // Render Albums
        return this.do_albums();
    },
    markup: function(){
        var output = `
            <div class="home_container_ navpage">
                
                <div class="strma_playlists home_section">
                    <div class="cont_hdr_">Recommended Playlists</div>
                    <div class="playlists_body"></div>
                </div>
                
                <div class="cont_hdr_ pop_hdr_">Popular Artists</div>
                <div class="popular_artist_ home_section">
                    <div class="popular_artists"></div>
                </div>
                
                <div class="new_tracks_ home_section">
                    <div class="cont_hdr_">Popular Now</div>
                    <div class="newtracks_body"></div>
                    <div class="show_more"><div class="shw_btn_ ripple" onclick="ldmr()">Show More</div></div>
                </div>
                
                <div class="new_albums_ home_section">
                    <div class="cont_hdr_">New Albums</div>
                    <div class="newalbums_body"></div>
                </div>

            </div>
        `;
        return output
    },
    doTracks: function(){
        // Show Less on smaller screens
        var limit = ( $(document)[0].body.clientWidth < 600)? 5 : 13;
        
        // Connect to DB and get songs
        firebase.database().ref("songs").orderByChild("timeStamp").limitToFirst(limit).on("value", function(snap){
            
            // Get Data from DB
            var songs = Object.values(  snap.val() );
            var keys = Object.keys(  snap.val() );
            
            // Map thru data to write to DOM
            var k =function(){
                songs.map( function(song, index){
                    if(song.songTitle != undefined){
                        // Mark up of playlist item
                        var markup = Home_.track_markup(song.songTitle, song.artist, song.image, index);
                        // Render item to DOM
                        $(".newtracks_body").append(markup)
                    }
                })
            }
            // delete "all" object
            keys.map(function(a,index){
                if(a == "all"){
                    // Clear Container
                    $(".newtracks_body").html("")
                    // delete all
                    keys.splice(index, 1);
                    // assign new key
                    State.last_item_key = keys[keys.length - 1]
                    // pop off offset
                    songs.pop()
                    // proceed
                    k()
                }
            })
        })
    },
    do_playlists: function (){
        // Connect to DB and get Playlists
        firebase.database().ref("playlists").on("value", function(snap){
            
            // Get Data from DB
            var playlists = Object.values(  snap.val() );
            
            // Map thru data to write to DOM
            playlists.map( function(playlist, index){
                if(playlist.playlistName != undefined){
                    // Mark up of playlist item
                    var markup = Home_.playlists_markup(playlist.artwork, playlist.playlistName, index);
                    // Render item to DOM
                    $(".playlists_body").append(markup)
                }
            })

        })

    },
    do_artists:function(){
        // Get artists
        firebase.database().ref("popularArtists").on("value", function(snap){
            var artists = Object.values(snap.val())

            // Loop thru data
            artists.map( function(artist){
                if(artist.genre != undefined){

                    // Get image URL then append item
                    firebase.storage().ref("artistImages/" + artist.artistImage).getDownloadURL().then(function(url) {
                        
                        // artist mark up
                        var artist_item = Home_.artist_markup(artist.artistName, url);

                        // Append to DOM
                        $(".popular_artists").append(artist_item);

                    })
                }
            })
        })
    },
    artist_markup:function(name, image){
        var ripple = ( $(document)[0].body.clientWidth < 600 )? "":"ripple";
        var output = `
            <article class="artist_item_popular_ `+ripple+`" onclick="artget(this)">
                <img class="img_popular_artist" src="`+image+`">
                <div class="artist_name artist">`+name+`</div>
            </article>
        `;
        return output
    },
    do_albums: function(){
        // Connect to DB and get Playlists
        firebase.database().ref("albums").on("value", function(snap){
            
            // Get Data from DB
            var albums = Object.values(  snap.val() );
            
            // Map thru data to write to DOM
            albums.map( function(album, index){
                if( album.albumTitle!= undefined){
                    // Mark up of playlist item
                    var markup = Home_.album_markup( album.albumTitle, album.Artist, album.albumArtwork, index)
                    // Render item to DOM
                    $(".newalbums_body").append(markup)
                }
            })

        })
    },
    playlists_markup: function(artwork, playlist_name, index){
        var output = `
            <div class="playlist_item_" onclick="plget(this)" id="playlist" title="`+index+`">
                <img src="`+artwork+`" class="playlist_artwork" title="`+index+`">
                <div class="playlist_name playlist" title="`+index+`">`+playlist_name+`</div>
            </div>
        `;
        return output
    },
    track_markup: function(songname_, artist_, img_, index){
        var output = `
            <div class="newtrack_item ripple"  id="song" title="`+index+`">
                <div class="_metaContainerCont_" onclick="_p_(this)">
                    <img src="`+img_+`" class="track_img_" title="`+index+`">
                    <div class="meta_itm_cont" title="`+index+`">
                        <div class="track_songname_ s_playname" title="`+index+`">`+songname_+`</div>
                        <div class="track_artist_ a_playname" title="`+index+`">`+artist_+`</div>
                    </div>
                </div>
                <div class="song_options_img_ocnt" onclick="_opts_(this)">
                    <img class="song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;
        return output
    },
    album_markup:function(album_, artist_, img_, index){

        var ripple_or_not = ( $(document)[0].body.clientWidth < 600)? "" : "ripple";

        var output = `
            <div class="album_item `+ripple_or_not+`" onclick="alget(this)" id="album" title="`+index+`">
                <img src="`+img_+`" class="album_img_" title="`+index+`">
                <div class="album_meta_itm_cont" title="`+index+`">
                    <div class="album_songname_ album" title="`+index+`"><div class="nme_hlder_home">`+album_+`</div></div>
                    <div class="album_artist_" title="`+index+`">`+artist_+`</div>
                    <span class="al_it_artist album_artist_db" title="`+index+`">`+artist_+`</span>
                </div>
            </div>
        `;
        return output
    },
    loadmore:function(){
        if($(".newtracks_body").hasClass("unset_grid") == false){
            
            // Show Less on smaller screens
            var limit = ( $(document)[0].body.clientWidth < 600)? 5 : 13;
            
            firebase.database().ref("songs").orderByKey().startAt(State.last_item_key).limitToFirst(limit).on("value", function(snap){
                var songs = Object.values(snap.val());
                var keys = Object.keys(snap.val());
                
                if( songs.length > 2){
                    // Save offset itemKey
                    State.last_item_key = keys[keys.length - 1]
                    // pop off offset
                    songs.pop()
                    // Clear Container
                    $(".newtracks_body").html("")
                    // Proceed
                    songs.map( function(song, index){
                        if(song.songTitle != undefined){
                            // Mark up of playlist item
                            var markup = Home_.track_markup(song.songTitle, song.artist, song.image, index);
                            // Render item to DOM
                            $(".newtracks_body").append(markup)
                        }
                    })
                }
                else if(songs.length <= 2){
                    $(".newtracks_body").addClass("unset_grid")
                    return $(".newtracks_body").html(`<p style="width:84vw; text-align:center">All Songs Appended</p><p style="font-weight:100; font-size:12px; text-align: center; width: 84vw;">Click button below again to go back to first songs.</p>`)
                }
            
                
            })
        }
        else if($(".newtracks_body").hasClass("unset_grid") == true){
            $(".newtracks_body").removeClass("unset_grid");
            return Home_.doTracks()
        }
    }
}

// Load more songs
var ldmr = function(){
    return Home_.loadmore()
}
var hm_rndr_ = function(){
    if($(".app_body_").find(".home_container_").length >0){
        return Home_.render()
    }
}