var Latest = {
    // Render and Container Markup
    page_markup: function(){
        var output = `
            <div class="new_release_cont_ navpage">
                <h1 class="nw_cont_hdr">New Releases</h1>
                <div class="newrelease_tabs">
                    <button class="release_tab_new newsongs_tab_ tab_active_new" data-name="songtab" onclick="_taber_(this)">Songs</button>
                    <button class="release_tab_new newalbums_tab_" data-name="albumtab" onclick="_taber_(this)">Albums</button>
                </div>
                <div class="newrelease_cont_tabs">  </div>
                <button class="pagination_container" onclick="">Load More</button>
            </div>
        `;
        return output
    },
    render:function(){
        // Get markup
        var markup = this.page_markup();
        // Render Container
        $(".app_body_").html(markup);
        // Render Songs
        return this.get_songs()
    },
    song_tab_markup: function(){
        var output = `
            <section class="albums-all-cont">
                <h1 class="releases_cont_hdr_">Latest Albums</h1>
                <div class="album_cont_new"></div>
                <div class="pagination_container" onclick="loadsongs()">Load More</div>
            </section>
        `;
        return output
    },
    album_tab_markup: function(){
        var output = `
            <section class="albums-all-cont">
                <h1 class="releases_cont_hdr_">Latest Albums</h1>
                <div class="album_cont_new"></div>
                <div class="pagination_container" onclick="loadalbums()">Load More</div>
            </section>
        `;
        return output
    },
    // Album & Song Markup
    song_mkp:function(songname_, artist, artwork, index){
        if(songname_.length > 18){
            songname_ = songname_.substring(0, 18) + "...";
        }
        if(artist.length > 18){
            artist = artist.substring(0, 18) + "...";
        }
        var output = `
            <div class="latest_songitem" id="song" onclick="_opts_m(this)" title="`+index+`">
                <div class="_songartwork_new">
                    <img class="_songart_work_new" src="`+artwork+`">
                </div>
                <div class="latest_itm_cont"  title="`+index+`">
                    <div class="track_songname_ s_playname" title="`+index+`">`+songname_+`</div>
                    <div class="track_artist_ a_playname" title="`+index+`">`+artist+`</div>
                </div> 
            </div>
        `;
        return output
    },
    album_markup:function(album_, artist_, img_, index){
        
        if(album_.length > 18){
            album_ = album_.substring(0, 18) + "...";
        }
        if(artist_.length > 18){
            artist_ = artist_.substring(0, 18) + "...";
        }

        var output = `
            <div class="album_item " onclick="alget(this)" id="album" title="`+index+`">
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
    // get Songs and Albums
    get_albums:function(){
        // Append Album Paginator
        $(".pagination_container").removeClass("disabled_");
        $(".pagination_container").attr("onclick", "loadalbums()");
        $(".pagin_message").remove()
        
        // Get Albums
        firebase.database().ref("albums").orderByChild("timeStamp").limitToFirst(10).on("value", function(snap){
            var albums = Object.values(snap.val());
            var keys = Object.keys(snap.val());

            // Render albums
           var k = function(){
            albums.map( function(album, index){
                if( album.albumTitle!= undefined){
                    // Mark up of playlist item
                    var markup = Latest.album_markup( album.albumTitle, album.Artist, album.albumArtwork, index)
                    // Render item to DOM
                    $(".newrelease_cont_tabs").append(markup)
                }
            })
           }

            // delete "all" object
            keys.map(function(a,index){
                if(a == "albums"){
                    // delete all
                    keys.splice(index, 1);
                    // assign new key
                    State.last_item_key_albums = keys[keys.length - 1]
                    // pop off offset
                    albums.pop()
                    // proceed
                    k()
                }
            })
        })
    },
    get_songs:function(){
        firebase.database().ref("songs").orderByChild("timeStamp").limitToFirst(9).on("value", function(snap){
            // Append Song Paginator Clickhandler
            $(".pagination_container").removeClass("disabled_");
            $(".pagination_container").attr("onclick", "loadsongs()");
            $(".pagin_message").remove()

            // Get Songs
            var songs = Object.values(snap.val());
            var keys = Object.keys(snap.val());

            // Map thru data to write to DOM
            var k =function(){
                songs.map( function(song, index){
                    if(song.songTitle != undefined){
                        // Mark up of playlist item
                        var markup = Latest.song_mkp(song.songTitle, song.artist, song.image, index);
                        // Render item to DOM
                        $(".newrelease_cont_tabs").append(markup)
                    }
                })
            }

            // delete "all" object
            keys.map(function(a,index){
                if(a == "all"){
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
    // Change Tab Function
    tabber:function(param){
        var tab = $(param).attr("data-name"); //songstab | albumtab
        
        // Change Tab Active
        $('.release_tab_new').removeClass("tab_active_new")
        $(param).addClass("tab_active_new");

        // Clear container
        $(".newrelease_cont_tabs").html("")
        
        // Add Active Tab
        if("albumtab" == tab){
            // Render songs
            return this.get_albums()
        }
        else if("songtab" == tab){
            // Render Albums
            return this.get_songs()
        }
    },
    // Load More Function => Songs
    loadmore:function(type){
        if(type == "songs"){
            firebase.database().ref("songs").orderByKey().startAt(State.last_item_key).limitToFirst(12).on("value", function(snap){
                var songs = (snap.val() == null || snap.val() == undefined)? [] : Object.values(snap.val());
                var keys = (snap.val() == null || snap.val() == undefined)? [] : Object.keys(snap.val());
            
                // Save offset itemKey
                State.last_item_key = (keys.length == 0)? 0 : keys[keys.length - 1];
                // pop off offset
                songs.pop()
                // Clear Container
                $(".songs_cont_new").html("")
                // Proceed
                if( songs.length <= 0){
                    $(".pagin_message").remove()
                    $(`<div class="pagin_message">End of List</div>`).insertAfter(".newrelease_cont_tabs");
                    $(".pagination_container").addClass("disabled_");
                }else{
                    songs.map( function(song, index){
                        if(song.songTitle != undefined){
                            // Mark up of playlist item
                            var markup =  Latest.song_mkp(song.songTitle, song.artist, song.image, index);
                            // Render item to DOM
                            $(".newrelease_cont_tabs").append(markup)
                        }
                    })
                }
            })
        }
        else if(type == "albums"){
            firebase.database().ref("albums").orderByKey().startAt(State.last_item_key_albums).limitToFirst(5).on("value", function(snap){
                var albums = (snap.val() == null || snap.val() == undefined)? [] : Object.values(snap.val());
                var keys = (snap.val() == null || snap.val() == undefined)? [] : Object.keys(snap.val());
            
                // Save offset itemKey
                State.last_item_key_albums = (keys.length == 0)? 0 : keys[keys.length - 1];
                // pop off offset
                albums.pop()
                // Clear Container
                $(".songs_cont_new").html("")
                // Proceed
                if( albums.length <= 0){
                    $(".pagin_message").remove()
                    $(`<div class="pagin_message">End of List</div>`).insertAfter(".newrelease_cont_tabs");
                    $(".pagination_container").addClass("disabled_");
                }else{
                    albums.map( function(album, index){
                        if(album.albumTitle != undefined){
                            // Mark up of playlist item
                            var markup = Latest.album_markup( album.albumTitle, album.Artist, album.albumArtwork, index)
                            // Render item to DOM
                            $(".newrelease_cont_tabs").append(markup)
                        }
                    })
                }
            })
        }
    }
}

var _taber_ = function(param){
    return Latest.tabber(param)
}
var loadalbums = function(){
    return Latest.loadmore("albums")
}
var loadsongs = function(){
    return Latest.loadmore("songs")
}
