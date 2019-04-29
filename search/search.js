

var search = {
    srch:function(){
        // If Mobile Screen
        if($(document)[0].body.clientWidth < 600){
            // Remove placeholder
            $(".placeholder_logo_container_srch").remove()

            // Run Query
            this.go()
        }
        // Wide Screens
        else{
            this.go()
        }

    },
    go: function(){
        // close search
        window.clssrch_ = function(){
            // Remove button
            $(".cls_src_btn").remove()
            // Clear Input Val
            $(".search_bar").val('')
            
            return $(".resultsContainer").remove(), $(".result_cont_mobile").remove() 
        }

        // Close Button
        var button = `<span class="cls_src_btn" onclick="clssrch_()"><img src="./../../assets/icon/close.png" class="cls_srch_btn"></span>`
        
        // Search value
        var val  = ($(document)[0].body.clientWidth < 600) ? $(".searchmobile_mobile").val() : $(".search_bar").val();

        // Determine if bar empty
        if ( val.length > 0){

            // Add Close Button
            ($(document)[0].body.clientWidth > 600) ? $(".search_bar_cont").prepend(button) : null;
            
            // Get container markup
            var res_cont = this.result_cont();
            var mobile_container = this.result_cont_mobile();
            
            // Append Container function
            if( $(".resultsContainer").length == 0 && $(document)[0].body.clientWidth < 600){
                $(".srch_page_mobile").append(mobile_container);
            }
            else if($(".resultsContainer").length == 0 && $(document)[0].body.clientWidth > 600){
                $(".app_body_").append(res_cont)
            }

            // Append Container DOM
            // ($(document)[0].body.clientWidth < 600) ? append_cont() : $(".app_body_").append(res_cont);

            // Format term for search
            var query = val.split(" ").map( function(x){return x.charAt(0).toUpperCase() + x.slice(1)}).join(" ");
            
            // Render results
            return (
                this.qry_songs(query),
                this.qry_artists(query),
                this.qry_albums(query)
            )


        }
        else if( val.length <= 0){
            return clssrch_()
        }
    },
    result_cont:function(){
        var output = `
            <div class="resultsContainer">
                
                <h1 class="res_cont_hdr_main">Search Results</h1>
                
                <div class="res_main_cont">
                    <div class="sng_results_container">
                        <h1 class="res_cont_hdr_res">Songs</h1>
                        <div class="res_legend">
                            <span class="legend_item">Title</span>
                            <span class="legend_item">Artist</span>
                            <span class="legend_item">Streams</span>
                        </div>
                        <div class="song_res_main_cont"></div>
                    </div>
                    
                    <div class="art_albm_cont_">
                        <div class="albm_resukts_cont">
                            <h1 class="res_cont_hdr_re">Albums</h1>
                            <div class="album_res_main_cont"></div>
                        </div>
                        <div class="artist_resukts_cont">
                            <h1 class="res_cont_hdr_re">Artists</h1>
                            <div class="artists_res_main_cont"></div>
                        </div>
                    </div>
                </div>

            </div>
        `;
        return output
    },
    a_rslt:function(artist, image){
        var output = `
            <article class="artist_resultItem_" onclick="artget(this)" id="artist">
                <img src="`+image+`" class="art_res_item_img_">
                <span class="art_res_item_name_ artist">`+artist+`</span>
            </article>
        `;
        return output
    },
    s_rslt:function(songname, artist, streams, index){
        var streams_ = streams;
        var output = `
            <div class="song_container">
                <div class="song_item_album_ ripple" onclick="_p_(this)" id="song" title="`+index+`">
                    <span class="albmtrack_item_index" title="`+index+`"><img src="./../../assets/note.png" class="note_sng_itm"title="`+index+`"></span>
                    <span class="songname_result" title="`+index+`"><div class="s_playname"title="`+index+`">`+songname+`</div></span>
                    <span class="artist_result" title="`+index+`"><div class="a_playname" title="`+index+`">`+artist+`</div></span>
                    <span class="streams_result" title="`+index+`"><div title="`+index+`">`+streams_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="_opts_(this)">
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
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+songname+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
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
    al_rslt:function(artist, album, image, index){
        if(album.length > 18){
            album = album.substring(0, 18) + "...";
        }
        if(artist.length > 18){
            artist = artist.substring(0, 18) + "...";
        }
        var output = `
            <div class="album_item_res ripple" onclick="alget(this)" id="album" title="`+index+`">
                <img src="`+image+`" class="album_img_res" title="`+index+`">
                <div class="album_meta_itm_cont_res" title="`+index+`">
                    <div class="album_songname_res album" title="`+index+`">`+album+`</div>
                    <div class="album_artist_res" title="`+index+`">`+artist+`</div>
                    <span class="al_it_artist album_artist_db" title="`+index+`">`+artist+`</span>
                </div>
            </div>
        `;
        return output
    },
    qry_songs:function(query_){
        // Empty Conainer
        $(".song_res_main_cont").html("")
        // Query DB of Term
        firebase.database().ref("songs").orderByChild("songTitle").startAt(query_).endAt(query_+"\uf8ff").on("value", function(snap){
            // Map thru results and append to dom
            if(snap.val() != null || snap.val() != undefined){
                Object.values(snap.val()).map(function(result, index){
                    var markup = search.s_rslt(result.songTitle, result.artist, result.streamCount, index);
                    $(".song_res_main_cont").append(markup)
                })
            }else {return}
        })
    },
    qry_albums:function(query_){
        // Empty Container
        $(".album_res_main_cont").html("")
        // Query DB of Term
        firebase.database().ref("albums").orderByChild("albumTitle").startAt(query_).endAt(query_+"\uf8ff").on("value", function(snap){
            // Map thru results and append to dom
            if(snap.val() != null || snap.val() != undefined){
                Object.values(snap.val()).map(function(result, index){
                    var markup = search.al_rslt(result.Artist, result.albumTitle, result.albumArtwork, index);
                    $(".album_res_main_cont").append(markup)
                })
            }else {return}
        })
    },
    qry_artists:function(query_){
        // Empty Conainer
        $(".artists_res_main_cont").html("")
        // Query DB of Term
        firebase.database().ref("artists").orderByChild("artistName").startAt(query_).endAt(query_+"\uf8ff").on("value", function(snap){
            // Map thru results and append to dom
            if(snap.val() != null || snap.val() != undefined){
                Object.values(snap.val()).map(function(result, indexedDB){
                    var markup = search.a_rslt(result.artistName, result.artistImage);
                    $(".artists_res_main_cont").append(markup)
                })
            }else {return}
        })
    },
    mobile: function(){
        var markup = this.mobile_page();
        return $(".App_Root").append(markup)
    },
    mobile_page:function(){
        var output = `
            <div class="srch_page_mobile navpage">
                <div class="srch_inptcont">
                    <svg class="input_iconserch" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.96 90.06"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:5px;}.cls-2{fill:#fff;}
                        </style></defs><title>search</title><ellipse class="cls-1" cx="38.91" cy="38.22" rx="36.41" ry="35.72"></ellipse><path class="cls-2" d="M577,992.45a27.87,27.87,0,0,0,7.12-6.75l17.25,15.78s-.49,6.71-6.69,7.52Z" transform="translate(-510.45 -918.94)" style=""></path></svg>
                    <input class="searchmobile_mobile" onkeyup="srch()" placeholder="Song, artist or album...">
                </div>
                
                <div class="placeholder_logo_container_srch">
                    <svg class="srchpage_menu_icn" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.96 90.06"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:5px;}.cls-2{fill:#fff;}
                    </style></defs><title>search</title><ellipse class="cls-1" cx="38.91" cy="38.22" rx="36.41" ry="35.72"></ellipse><path class="cls-2" d="M577,992.45a27.87,27.87,0,0,0,7.12-6.75l17.25,15.78s-.49,6.71-6.69,7.52Z" transform="translate(-510.45 -918.94)" style=""></path></svg>
                    <span>Search any song, artist <br/> or album.</span>
                </div>
            </div>
        `;
        return output
    },
    result_cont_mobile:function(){
        var output = `
            <div class="result_cont_mobile">
                <div class="sng_results_container">
                    <h1 class="res_cont_hdr_re">Songs</h1>
                    <div class="song_res_main_cont"></div>
                </div>
                <div class="artist_resukts_cont">
                    <h1 class="res_cont_hdr_re">Artists</h1>
                    <div class="artists_res_main_cont"></div>
                </div>
                <div class="albm_resukts_cont">
                    <h1 class="res_cont_hdr_re">Albums</h1>
                    <div class="album_res_main_cont"></div>
                </div>
                
            </div>
        `;
        return output
    }

}

var srch = function(){
    return search.srch()
}