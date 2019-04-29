var Nav = {
    route:function(e){
        // Get Nav Name
        var page = ($(e).attr("data-name") != "home_logo" )? $(e).find(".btn_title_mbl").text().trim() : "Home";

        // Change Active Class
        $(".nav_itm_mob").removeClass("navtab_active_");
        ($(e).attr("data-name") != "home_logo" )? $(e).addClass("navtab_active_") : $('.home_mbl').addClass("navtab_active_");
        
        // Route to Page
        switch(page){
            case "Home":
                // close all other
                $(".srch_page_mobile").remove()
                $(".librarypage_mob").remove()
                $(".new_release_cont_").remove()

                return Home_.render()
            case "Latest":
                // close all other
                $(".srch_page_mobile").remove()
                $(".librarypage_mob").remove()
                $(".new_release_cont_").remove()

                return Latest.render()
            case "Search":
                // close all other
                $(".srch_page_mobile").remove()
                $(".librarypage_mob").remove()
                $(".new_release_cont_").remove()

                return search.mobile()
            case "Library":
                // close all other
                $(".srch_page_mobile").remove()
                $(".librarypage_mob").remove()
                $(".new_release_cont_").remove()
                
                return Pages.library_mobile()
        }
    },
    menu:function(){
        var menu = `
        <div class="context_menu_mobile">
            <span class="cxt_menu_item" onclick="signout()">Sign Out</span>
            <span class="cxt_menu_item" onclick="close_mnu()">Close</span>
        </div>
        `;
        return $('.App_Root').append(menu)
    }
}
 
var rte_ = function(e){
    return Nav.route(e)
}
var menu_mobile = function(){
    return Nav.menu()
}
