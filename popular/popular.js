var Popular_ = {
    render:function(){
        // Get page MArkup
        var markup = this.markup();

        // Render Page Markup
        $(".app_body_").html(markup);

        // Render Artists
        return this.renderArtists()
    },
    markup: function(){
        var output = `
            <div class="popular_cont_">

                <section class="genre_container">
                    <h1 class="genre_hdr_l">Dancehall</h1>
                    <div class="dancehall_artists_cont_"></div>
                </section>

                <section class="genre_container">
                    <h1 class="genre_hdr_l">Popular Music</h1>
                    <div class="other_artists_cont_"></div>
                </section>
                
            </div>
        `;
        return output
    },
    renderArtists: function(){
        // Get artists
        firebase.database().ref("popularArtists").on("value", function(snap){
            var artists = Object.values(snap.val())

            // Loop thru data
            artists.map( function(artist){
                if(artist.genre != undefined){

                    // Get image URL then append item
                    firebase.storage().ref("artistImages/" + artist.artistImage).getDownloadURL().then(function(url) {
                        
                        // artist mark up
                        var artist_item = Popular_.artist_markup(artist.artistName, url);

                        // Append to DOM
                        if( artist.genre == "Zim-Dancehall"){
                            $(".dancehall_artists_cont_").append(artist_item)
                        }
                        else{
                            $(".other_artists_cont_").append(artist_item)
                        }
                    })
                }
            })
        })
    },
    artist_markup:function(name, image){
        var output = `
            <article class="artist_item_popular_ ripple" onclick="artget(this)">
                <img class="img_popular_artist" src="`+image+`">
                <div class="artist_name artist">`+name+`</div>
            </article>
        `;
        return output
    }
}