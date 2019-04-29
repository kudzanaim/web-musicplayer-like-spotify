var Pages = {
    artist_markup:function(artist_name, artwork){
        var output = `
            <div class="album_page_ artist_page_tag closedPage">
                <div class="artist_meta_container">
                    <button class="close_page ripple" onclick="clspge(this)">Close</button>
                    <div class="artwork_albm_cont"><img class="artist_artwork_open" src="`+artwork+`"></div>
                    <div class="album_name_open">`+artist_name+`</div>
                    <div class="type_">artist</div>
                </div>
                <div class="artist_library">
                    <div class="page_hdr_artist_prof">Artist Profile</div>

                    <div class="artist_popular_music">
                        <h1 class="popular_artist_header_">Popular</h1>
                        <div class="popular_songs_cont"></div>
                    </div>

                    <div class="latest_rls_artist_music_">
                        <h1 class="popular_artist_header_">Latest Release</h1>
                    </div>

                    <div class="artist_albums_music">
                        <h1 class="popular_artist_header_">Albums</h1>
                        <div class="artist_albums_cont"></div>
                    </div>
                </div>
            </div>
        `;
        return output
    },
    latestSong:function(title, image, date, type, artist, index){
        var album = `
            <article class="new_release_song ripple" id="`+type+`" title="`+index+`" onclick="nw_rls(this)">
                <img class="nw_rls_img" src="`+image+`" title="`+index+`">
                <section class="nw_rls_meta" title="`+index+`">
                    <span class="title_nw_rels album" title="`+index+`">`+title+`</span>
                    <span style="display:none" class="title_nw_rels album_artist_db" title="`+index+`">`+artist+`</span>
                    <span class="date_nw_rels" title="`+index+`">`+new Date(date).toDateString()+`</span>
                </section>
            </article>
        `;
        var song = `
        <article class="new_release_song ripple" id="`+type+`" title="`+index+`" onclick="nw_rls(this)">
                <img class="nw_rls_img" src="`+image+`" title="`+index+`">
                <section class="nw_rls_meta" title="`+index+`">
                    <span class="title_nw_rels s_playname" title="`+index+`">`+title+`</span>
                    <span style="display:none" class="title_nw_rels a_playname" title="`+index+`">`+artist+`</span>
                    <span class="date_nw_rels" title="`+index+`">`+new Date(date).toDateString()+`</span>
                </section>
        </article>
        `;
        
        // Switch
        switch(type){
            case "album":
                return album
            case "song":
                return song
        }
    },
    getalbum:function(album_name, artist_){
        firebase.database().ref("albums").orderByChild("albumTitle").startAt(album_name).endAt(album_name+"\uf8ff").on("child_added", function(snap){
            // If artist match
            if(  artist_ == snap.val().Artist){
                var album = snap.val();
                var markup = Pages.album_markup( album.albumTitle ,album.albumArtwork, album.Artist, album.Tracklist.length );
                var tracklist = album.Tracklist;
    
                // Add page Change to session
                sessionStorage.setItem("Page", "album")

                // Append Containter
                $(".app_body_").append(markup)
                
                // Append Tracklist
                return tracklist.map(function(track, index){
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(track).endAt(track+"\uf8ff").on("child_added", function(snapp){
                        var item = snapp.val();
                        var song = Pages.al_track_mk_up(item.songTitle, item.artist, item.streamCount, index);
                        $(".album_trcks_cont").append(song)
                    })
                })
            }
        })
    },
    getplaylist:function(playlistname){
        firebase.database().ref("playlists").orderByChild("playlistName").startAt(playlistname).endAt(playlistname+"\uf8ff").on("child_added", function(snap){
            var playlist = snap.val();
            var markup = Pages.playlist_markup( playlist.playlistName ,playlist.artwork, "Strma", playlist.tracks.length );
            var tracklist = Object.values(playlist.tracks);

            // Append Containter
            $(".album_page_").remove()
            $(".app_body_").append(markup)
            $(".album_page_").addClass("playlist_page_tag")
            $(".type_").text("playlist")

            // Add page Change to session
            sessionStorage.setItem("Page", "playlist")
            
            // Append Tracklist
            return tracklist.map(function(track, index){
                if( track != undefined){
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(track.songTitle).endAt(track.songTitle+"\uf8ff").on("child_added", function(snapp){
                        var item = snapp.val();
    
                        if(track.artist == item.artist && track.songTitle == item.songTitle){
                            var song = Pages.artist_track_mk_up(item.songTitle, item.artist, item.streamCount, index);
                            $(".album_trcks_cont").append(song)
                        }
                    })
                }
            })
        })
    },
    getartist:function(artist_){
        firebase.database().ref("artists").orderByChild("artistName").startAt(artist_).endAt(artist_+"\uf8ff").on("child_added", function(snap){
            // Markup && Data
            var artist = snap.val();
            var markup = Pages.artist_markup(artist_, artist.artistImage);

            // Append Container to DOM
            $(".app_body_").append(markup)

            // Query top 5 artists song
            firebase.database().ref("songs").orderByChild("artist").startAt(artist_).endAt(artist_+"\uf8ff").once("value", function(snap){
                // If artists has Songs
                var do_ = async function(){
                    // Song Array
                    var artist = await Object.values(snap.val())
                    // Sort Songs
                    var sorted = _.orderBy(artist, ['streamCount'], ['desc'])
                    // Slice Popular songs
                    sorted.length = 5
                    // Map thru songs and append to DOM
                    sorted.map(function(song, index){
                        var markup_ = Pages.artist_track_mk_up(song.songTitle, song.artist, song.streamCount, index);
                        $(".popular_songs_cont").append(markup_)
                    })
                    // Get Latest released Song or Album
                    var sortd_sngs_dte = _.orderBy(artist, ["timeStamp"], ["desc"]);    var song1 = sortd_sngs_dte[0];

                    firebase.database().ref("albums").orderByChild("Artist").startAt(artist_).endAt(artist_+"\uf8ff").on("value", function(snap){
                        var album = Object.values(snap.val());
                        var srtd_albums = _.orderBy(album, ["timeStamp"], ["desc"]);
                        var album1 = srtd_albums[0];

                        // Return latest release
                        console.clear()
                        if(album1.timeStamp >=  song1.timeStamp){
                            var _markup = Pages.latestSong(album1.albumTitle, album1.albumArtwork,album1.timeStamp, "album", album1.Artist);
                            $(".latest_rls_artist_music_").append(_markup)
                        }
                        else{
                            var markup_ = Pages.latestSong(song1.songTitle, song1.image, song1.timeStamp, "song", song1.artist);
                            $(".latest_rls_artist_music_").append(markup_)
                        }
                    })

                    
                }
                // If no Songs
                var no_ = function(){
                    return $(".popular_songs_cont").html(`
                        <div class="artist_no_songs">Sorry! This artist has no songs Posted</br> to their profile.</div>
                    `) 
                }
                // Turnary
				if( snap.numChildren() > 0) {
                    // Get Songs
                    do_();
                    // Get Albums
                    Pages.get_artists_albums(artist_)
                }
                else if(snap.numChildren() == 0){
                    no_()
                }
            })

        })
    },
    album_markup:function(album_name, artwork, artist, num_songs){
        var output = `
            <div class="album_page_ album_page_tag closedPage">
                <div class="album_meta_container">
                    <button class="close_page ripple" onclick="clspge(this)">Close</button>
                    <div class="type_">album</div>
                    <div class="artwork_albm_cont artwork_playlist_cont"><img class="album_artwork_open" src="`+artwork+`"></div>
                    <div class="album_name_open">`+album_name+`</div>
                    <div class="album_artist_open" onclick="">By `+artist+`</div>
                    <div class="numsongs_open">`+num_songs+` Songs</div>
                    <button class="playall_ ripple" onclick="">Play All</button>
                </div>
                <div class="tracklist_container">
                    <h1 class="tracklist_header_">Tracklist</h1>
                    <div class="album_legend_open">
                        <span class="albm_lgnd_item">Title</span>
                        <span class="albm_lgnd_item">Featured Artists</span>
                        <span class="albm_lgnd_item">Streams</span>
                    </div>
                    <div class="album_trcks_cont"></div>
                </div>
            </div>
        `;
        return output
    },
    playlist_markup:function(playlist_name, artwork, artist, num_songs){
        var output = `
            <div class="album_page_ album_page_tag closedPage">
                <div class="album_meta_container">
                    <button class="close_page ripple" onclick="clspge(this)">Close</button>
                    <div class="type_">album</div>
                    <div class="artwork_albm_cont artwork_playlist_cont"><img class="album_artwork_open album_playlist_open" src="`+artwork+`"></div>
                    <div class="album_name_open">`+playlist_name+`</div>
                    <div class="album_artist_open" onclick="">By `+artist+`</div>
                    <div class="numsongs_open">`+num_songs+` Songs</div>
                    <button class="playall_ ripple" onclick="">Play All</button>
                </div>
                <div class="tracklist_container">
                    <h1 class="tracklist_header_">Tracklist</h1>
                    <div class="album_legend_open">
                        <span class="albm_lgnd_item">Title</span>
                        <span class="albm_lgnd_item">Featured Artists</span>
                        <span class="albm_lgnd_item">Streams</span>
                    </div>
                    <div class="album_trcks_cont"></div>
                </div>
            </div>
        `;
        return output
    },
    al_track_mk_up:function(title, artist, streams, index){
        var output = `
        <div class="song_container">
            <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                    <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                    <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
            </div>
            <div class="song_options_img_ocnt" onclick="opts(this)" id="opts">
                <img class="_song_options_" src="./../../assets/icons/more.png">
            </div>

        </div>
        `;

        var output_mobile = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts(this)" id="opts">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;

        // if mobile then close context menu
        output = ( $(document)[0].body.clientWidth < 600)? output_mobile : output;

        return output
    },
    pl_track_mk_up:function(title, artist, streams, index){
        var output = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                    <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                    <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts(this)" id="opts">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;

        var output_mobile = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts_(this)" id="opts_">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;

        // if mobile then close context menu
        output = ( $(document)[0].body.clientWidth < 600)? output_mobile : output;

        return output
    },
    artist_track_mk_up:function(title, artist, streams, index){
        var output = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                    <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                    <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts(this)" id="opts">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;

        var output_mobile = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts(this)" id="opts_">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;

        // if mobile then close context menu
        output = ( $(document)[0].body.clientWidth < 600)? output_mobile : output;

        return output
    },
    get_artists_albums:function(artist_){
        firebase.database().ref("albums").orderByChild("Artist").startAt(artist_).endAt(artist_+"\uf8ff").once("value", function(snap){
            // Map thru Albums
            var map_ = function(){
                // Albums await
                var albums = Object.values(snap.val());
                // Loop Thru
                albums.map(function(album, index){
                    var markup = Pages.albm_mkup_artist(album.albumTitle, album.albumArtwork, album.releaseDate, artist_);
                    $(".artist_albums_cont").append(markup)
                })
            }
            // If no Albums
            var no_ = function(){
                return $(".album_trcks_cont").html(`
                    <div class="artist_no_songs">This artist has no Albums Posted to </br>their profile.</div>
                `) 
            }
            // Turnary
			if( snap.numChildren() > 0) {
                map_()
            }
            else if(snap.numChildren() == 0){
                no_()
            }
        })
    },
    albm_mkup_artist:function(album, artwork, date, artist){
        var output = `
            <div class="artists_albms_item_art" onclick="alget(this)">
                <img class="al_it_img" src="`+artwork+`">
                <span class="al_it_title album">`+album+`</span>
                <span class="al_it_date">`+date+`</span>
                <span class="al_it_artist album_artist_db">`+artist+`</span>
            </div>
        `;
        return output
    },
    render_page:function(type, param){

        // Switch between Page Type
        switch(type){
            // Playlists
            case "playlist":
                // playlist name
                sessionStorage.setItem("Page", "Playlist")
                var playlist = $(param).find(".playlist").text()
                return  this.getplaylist(playlist)
            case "usr_playlist":
                // playlist name
                sessionStorage.setItem("Page", "Playlist")
                var playlist_ = $(param).find(".playlist").text()
                return  this.usr_plylist(playlist_)
            case "album":
                // album name
                sessionStorage.setItem("Page", "Album")
                var album = $(param).find(".album").text()
                var artistt = $(param).find(".album_artist_db").text()
                return this.getalbum(album, artistt)
            case "artist":
                // artist name
                sessionStorage.setItem("Page", "Artist")
                var artist = $(param).find(".artist").text()
                return this.getartist(artist)
        }
    },
    cls:function(param){

        $(".album_page_").addClass("closepage")

        let type = $(param).parent().find(".type_").text()
        
        setTimeout(() => {
            $(".album_page_").addClass("closedPage")
            switch(type){
                case "playlist":
                    return $(".playlist_page_tag").remove()
                case "album":
                    return $(".album_page_tag").remove()
                case "artist":
                    return $(".artist_page_tag").remove()
            }
        }, 230);
    },
    usr_plylist:function(playlistname){
        var count = 0;
        m_.database().ref("Users/"+State.usr_.ky+"/playlists").orderByChild("playlistName").startAt(playlistname).endAt(playlistname+"\uf8ff").on("child_added", function(snap){
            var playlist = snap.val();
            var tracklist = Object.values(playlist.songs);
            var markup = Pages.usr_pl_mkup( playlist.playlistName, tracklist.length -1);
            
            // Add to State
            State.open_pl = {
                name: playlistname,
                k: snap.key
            };

            // Append Containter
            $(".album_page_").remove()
            $(".app_body_").append(markup)

            // Add page Change to session
            sessionStorage.setItem("Page", "playlist")
            
            // Append Tracklist
            return tracklist.map(function(track, index){
                if( track != undefined){
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(track.songTitle).endAt(track.songTitle+"\uf8ff").on("child_added", function(snapp){
                        var item = snapp.val();
    
                        if( item.songTitle && track.artist == item.artist && track.songTitle == item.songTitle ){ 
                            var song = Pages.pl_track_mk_up_(item.songTitle, item.artist, item.streamCount, count+1);
                            $(".album_trcks_cont").append(song);
                            count++;
                        }
                    })
                }
            })
        })
    },
    pl_track_mk_up_:function(title, artist, streams, index){
        var output = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                    <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                    <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts_(this)" id="opts_">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;
        var output_mobile = `
            <div class="song_container">
                <div class="albmtrack_item_open ripple" onclick="p_(this)" title="`+index+`" id="song">
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts_(this)" id="opts_">
                    <img class="_song_options_" src="./../../assets/icons/more.png">
                </div>
            </div>
        `;

        // if mobile then close context menu
        output = ( $(document)[0].body.clientWidth < 600)? output_mobile : output;
                
        return output
    },
    usr_pl_mkup:function(pl_name, num_songs){
        var output = `
            <div class="album_page_ playlist_page_tag closedPage">
                    <div class="album_meta_container">
                        <button class="close_page ripple" onclick="clspge(this)">Close</button>
                        <div class="type_">playlist</div>
                        <div class="artwork_albm_cont usrpl_artwork_albm_cont"><img class="album_artwork_open" src="./../../assets/turntable.jpg"></div>
                        <div class="album_name_open">`+pl_name+`</div>
                        <div class="album_artist_open" onclick="">By You</div>
                        <div class="numsongs_open">`+num_songs+` Songs</div>
                        <button class="playall_ ripple" onclick="">Play All</button>
                    </div>
                    <div class="tracklist_container">
                        <h1 class="tracklist_header_">Tracklist</h1>
                        <div class="album_legend_open">
                            <span class="albm_lgnd_item">Title</span>
                            <span class="albm_lgnd_item">Featured Artists</span>
                            <span class="albm_lgnd_item">Streams</span>
                        </div>
                        <div class="album_trcks_cont"></div>
                    </div>
                </div>
        `;
        return output
    },
    library_mobile:function(){
        // if logged in
        var lgn_status = State.lgn_sts;

        if(lgn_status == false){
            // Close Context
            $(".context_menu_mobile").remove();

            // If mobile or desktop
            var prompt_ = context.prompt_();
            ( $(document)[0].body.clientWidth < 600)? $(".App_Root").append(prompt_) : Lib.alert();
            
        }
        else if(lgn_status == true){
            // Get Markup
            var markup = this.library_markup();
            
            // Append Page
            $(".App_Root").append(markup)
    
            // Map pls
            m_.database().ref("Users/"+State.usr_.ky+"/playlists").once("value",function(snap){
                Object.values(snap.val()).map(function(pl, index){
                    if(pl.playlistName != undefined){
                        var pl_name = pl.playlistName; var numsongs = Object.values(pl.songs).length;
                        var pl_item = Pages.pl_item(pl_name, numsongs - 1);
        
                        $(".library_playlist_contM").append(pl_item)
                    }
                })
            })
        }
        
    },
    library_markup:function(){
        var output = `
            <div class="librarypage_mob">
                <div class="library_header_contM">
                    <span class="library_hdr_lg">Your Playlists</span>
                    <h1 class="library_hdr_small">Library</h1>
                </div>
                <div class="library_playlist_contM"></div>
            </div>
        `;
        return output
    },
    pl_item: function(pl_name, num_songs){
        var output = `
            <div class="pl_item_mobile" onclick="opn_pl(this)">
                <img class="pl_item_icon" src="./../../assets/icons/playlistPink.png">
                <span class="pl_item_meta">
                    <span class="pl_item_pl_name playlist">`+pl_name+`</span>
                    <span class="pl_item_numsongs">`+num_songs+` songs</span>
                </span>
                <span class="pl_item_arrIcon_cnt" onclick="">
                    <img class="pl_item_arrIcon" src="./../../assets/icons/right.png">
                </span>
            </div>
        `;
        return output
    }
    
}
// album click
var alget = function(param){
    return Pages.render_page("album", param)
}
// artist
var artget = function(param){
    return Pages.render_page("artist", param)
}
// playlist
var plget = function(param){
    return Pages.render_page("playlist", param)
}
// cls page
var clspge = function(param){
    return Pages.cls(param)
}