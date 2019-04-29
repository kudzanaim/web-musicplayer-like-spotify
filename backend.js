var int_ = {
    i:function(){
        // Meta
        var _u_ = int_.ulsrt();
        var o = JSON.stringify(_sqls_tfr);

        // Req D
        return $.post(_u_, o, function(_d_, _st_){
            return int_.it({sm:_d_.sm, sc:_d_.sc})
        })
    },
    it: function(c_){
        // Initialize Project
        var c = c_.sc;                 var c2 = c_.sm;
        firebase.initializeApp(c);     window.m_ = firebase.initializeApp(c2, "m_");

        // Start App
        if(m_ != undefined && firebase != undefined){
            return this.app()
        }
    },
    screenCheck: function(){
        // GEt device Name
        var ifNotified = State.screen_notify;
        var ifDevice = window.clientInformation.appVersion.includes("iPad")

        if(ifNotified == false && ifDevice == true){
            State.screen_notify = true;
            var markup = this.prompt_();

            return $(".App_Root").append(markup)
        }else{return }
    },
    prompt_:function(){
        var output = `
            <div class="prompt_container screen_prmt_">
                <div class="_prompt_t">
                    <div class="promptmessage_">For the best experience, we recommend flipping your screen horizontally for a perfect view.</div>
                    <div class="prompt_btn_cont_">
                        <button class="close_prompt" onclick="cls_prompt()">Close</button>
                    </div>
                </div>
            </div>
        `;
        return output
    },
    app:function(){
        // App Launch
        get_sess.check();
        //  Load Home Page
        _Router_.Route("Home", $(".home_btn_nav"))
        // URL
        window.history.replaceState({}, {}, "open.player");
        // Set left button click event listener
        context.rmv()
        // Nav Click Handler
        window.navx_click = function(param){
            return _Router_.Route($(param).text().trim(), param)
        }
        
    },
    ulsrt:function(){
        var y = ``;
        return y
    },
    conn:function(){
        navigator.connection.onchange = function(change){
            var status = navigator.onLine;
            if(status == true){
                // Alert User of Connection Change
                $(".connection_error").text(`Internet back Online`).css("background", "#077d2c")
                // Change root
                setTimeout(() => {
                    $(".App_Root").removeClass("no_connection") 
                }, 5500);
            }
            else{
                // Remove alert message
                $(".connection_error").remove()
                // Add Alert Message to DOM
                $(".App_Root").append(`<div class="connection_error">No Internet Connection</div>`);
                // Add Conn_err Class to Root
                $(".App_Root").addClass(`no_connection`);

            }
        }
    }
}

var get_sess = {
    check:function(){
        // Look in local storage
        var usr_check = JSON.parse(localStorage.getItem("amrts")); 

        // check state
        (usr_check != null)? Lib.lgn_in(usr_check.eml, usr_check.pss) : null;
        
    }
}

// must use enviroment variables fr security purposes.