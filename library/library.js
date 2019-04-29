var Lib = {
    opn:function(){
        if(State.lgn_sts == true){
            return this.playlists()
        }
        else{
            return this.alert()
        }
    },
    alrt:function(){
        var output = `
            <div class="alrt_cont_sgnin">
                <div class="messge_mscapp">You need to sign-in to be able to view your library.</div>
                <div class="btn_mscapp">
                    <button class="sign_btn_mscapp ripple" onclick="lgn()">Sign In</button>
                    <button class="create_acca_btn_mscapp ripple" onclick="sgnup()">Create Account</button>
                </div>
            </div>
        `;
        return output
    },
    alert:function(){
        var alert = this.alrt()
        
        // remove alert if exist
        $(".alrt_cont_sgnin").remove()
        
        // Append Alert
        $(".navigation_").append(alert).addClass("popup_fix")

        // Remove alert after 10sec
        return setTimeout(function(){
            $(".alrt_cont_sgnin").remove();
            $(".navigation_").removeClass("popup_fix")
        },10000)
    },
    sgn_up:function(){
        // Close Prompt if MObile
        $(".prompt_container").remove()

        // Get Markup
        var markup  = this.sgn_up_mkp();
        
        // Set  listener for login type selector
        window._fld_lstn = this.logtype_listener()

        return $(".App_Root").append(markup)
    },
    sgn_up_mkp:function(){
        var country_list = this.country_list();
        var output  = `
            <div class="sign_lgn_backg_cont">
                <div class="explain_page_">Register below to Create Account.</div>
                <div class="registeruser_cont_">
                    
                    <h1 class="reg_user_hdr_land1_">Sign Up</h1>
                    
                    <div style="padding-top: 0;" class="reguser_form_cornt_webapp">
                        <input class="reguserfrm_webapp first_sgnup" placeholder="Username" required>
                        <input type="password" class="reguserfrm_webapp lastnme_sgnup" placeholder="Password" required>
                        <select class="loginWith_type_ reguserfrm_webapp loginWith_type_selector" type="contactSelector">
                            <option value="">Login with Email or Phone</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                        </select>

                        <input type="email" class="reguserfrm_webapp email_userreg_landing" placeholder="Email" required>
                        <input type="tel" class="reguserfrm_webapp phone_userreg_landing" placeholder="Phone" required>

                        <input type="date" class="reguserfrm_webapp date_sgnup_" placeholder="Birthday" required>
                        <input class="reguserfrm_webapp cellphone_sgnup" placeholder="Cell Phone e.g. (77-843-3245)" required>
                        <div class="reguser_city_country_">
                            `+country_list+`
                            <input class="reguserfrm_webapp city_signup" placeholder="City/Town" required>
                        </div>
                        <input class="reguserfrm_webapp streetAddress_signup" placeholder="Street Address" required>
                        
                        <select class="gender_ loginWith_type_ reguserfrm_webapp ">
                            <option value="">Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>
                    <div class="btn_container_reguser_webapp">
                        <button class="sign_btn_reguser_login ripple" onclick="sgn()">Create</button>
                    </div> 
                </div>
                <button class="cls_sgn_lgn" onclick="c_lgnsgn()">Close</button>
            </div>
        `;
        var mobile  = `
            <div class="sign_lgn_backg_cont">
                
                <div class="registeruser_cont_">
                    
                    <h1 class="reg_user_hdr_land1_">Sign Up</h1>
                    <div class="explain_page_">Register below to Create Account.</div>
                    
                    <div style="padding-top: 0;" class="reguser_form_cornt_webapp">
                        <input class="reguserfrm_webapp first_sgnup" placeholder="Username" required>
                        <input type="password" class="reguserfrm_webapp lastnme_sgnup" placeholder="Password" required>
                        <select class="loginWith_type_ reguserfrm_webapp loginWith_type_selector" type="contactSelector">
                            <option value="">Login with Email or Phone</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                        </select>

                        <input type="email" class="reguserfrm_webapp email_userreg_landing" placeholder="Email" required>
                        <input type="tel" class="reguserfrm_webapp phone_userreg_landing" placeholder="Phone" required>

                        <input type="date" class="reguserfrm_webapp date_sgnup_" placeholder="Birthday" required>
                        <input class="reguserfrm_webapp cellphone_sgnup" placeholder="Cell Phone e.g. (77-843-3245)" required>
                        <div class="reguser_city_country_">
                            `+country_list+`
                            <input class="reguserfrm_webapp city_signup" placeholder="City/Town" required>
                        </div>
                        <input class="reguserfrm_webapp streetAddress_signup" placeholder="Street Address" required>
                        
                        <select class="gender_ loginWith_type_ reguserfrm_webapp ">
                            <option value="">Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>
                    <div class="btn_container_reguser_webapp">
                        <button class="sign_btn_reguser_login ripple" onclick="sgn()">Create</button>
                    </div> 
                    <button class="cls_sgn_lgn" onclick="c_lgnsgn()">Close</button>
                </div>
            </div>
        `;

        output = ( $(document)[0].body.clientWidth < 600)? mobile : output;

        return output
    },
    logtype_listener:function(){
        return setInterval(function(){
            if($(".loginWith_type_").val() != ""){
                // Clear Listener && Get Value of field
                clearInterval(_fld_lstn)
                var value = $(".loginWith_type_").val()

                // Open selected Login Type
                switch(value){
                    case "Email":
                        return $(".email_userreg_landing").css("display","block"), $(".loginWith_type_selector").css("display", "none")
                    case "Phone":
                        return $(".phone_userreg_landing").css("display","block"), $(".loginWith_type_selector").css("display", "none")
                }
            }
        },100)
    },
    lgn:function(){
        // Close Prompt if MObile
        $(".prompt_container").remove()

        // Get Markup
        var markup  = this.lgn_mkp();

        return $(".App_Root").append(markup)
    },
    lgn_mkp:function(){
        var output  = `
            <div class="sign_lgn_backg_cont _loginform_">
                <div class="explain_page_">Sign into your Account below.</div>
                <div class="_loginform_cont_p">
                        <h1 class="reg_user_hdr_land1_">Sign In</h1>
                        <div class="reguser_form_cornt_webapp">
                            <input type="email" class="reguserfrm_webapp usr_lgn_" placeholder="Username" required>
                            <input type="password" class="reguserfrm_webapp pss_lgn_" placeholder="Password" required>
                        </div>
                        
                        <div class="btn_container_reguser_webapp">
                            <button class="sign_btn_reguser_login _loginbtn_ ripple" onclick="lg_n()">Sign In</button>
                        </div> 
                </div>
                <button class="cls_sgn_lgn" onclick="c_lgnsgn()">Close</button>
            </div>
        `;
        var mobile  = `
            <div class="sign_lgn_backg_cont _loginform_">
                <div class="_loginform_cont_p">
                    
                    <h1 class="reg_user_hdr_land1_">Sign In</h1>
                    
                    <div class="explain_page_">Sign into your Account below.</div>
                        
                        <div class="reguser_form_cornt_webapp">
                            <input type="email" class="reguserfrm_webapp usr_lgn_" placeholder="Username" required>
                            <input type="password" class="reguserfrm_webapp pss_lgn_" placeholder="Password" required>
                        </div>
                        
                        <div class="btn_container_reguser_webapp">
                            <button class="sign_btn_reguser_login _loginbtn_ ripple" onclick="lg_n()">Sign In</button>
                        </div> 
                        
                        <button class="cls_sgn_lgn" onclick="c_lgnsgn()">Close</button>

                    </div>
            </div>
        `;
        output = ( $(document)[0].body.clientWidth < 600)? mobile : output;
        return output
    },
    country_list:function(){
        var output = `
            <select class="country_origin_ loginWith_type_  loginfrm_">
                <option value="">Select Country</option>
                <option value="Algeria">Algeria</option>
                <option value="Angola">Angola</option>
                <option value="Benin">Benin</option>
                <option value="Botswana">Botswana</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Congo">Congo</option>
                <option value="DRC">Democratic Republic of Congo</option>
                <option value="Cota D'Ivoire">Cote d'Ivoire</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Ghana">Ghana</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea Bissau">Guinea-Bissau</option>
                <option value="Kenya">Kenya</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Mali">Mali</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Namibia">Namibia</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Senegal">Senegal</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra">Sierra Leone</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="Sudan">Sudan</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Tanzania">Tanzania, United Republic of</option>
                <option value="Togo">Togo</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Uganda">Uganda</option>    
                <option value="Western Sahara">Western Sahara</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
            </select>
        `;
        return output
    },
    cls:function(){
        return $(".sign_lgn_backg_cont").remove()
    },
    sgn_reg:function(){
        //  Determine login type
        var login_type = ( $(".registeruser_cont_").find(".email_userreg_landing").css("display") == "block"  ) ? "Email": "Phone";
        var email = (login_type == "Email") ? $(".email_userreg_landing").val() : ``+$(".phone_userreg_landing").val()+`@strma.com`;
        // Get For Data
        var user_data = {
            data:{
                usr: $(".first_sgnup").val(),
                email:email,
                paswrd: $(".lastnme_sgnup").val(),
                gender: $(".gender_").val(),
                lgn_typ: login_type,
                lgn: $(".email_userreg_landing").val() || $(".phone_userreg_landing").val(),
                dob: $(".date_sgnup_").val(),
                cll: $(".cellphone_sgnup").val(),
                adrs: {
                    ntn: $(".country_origin_").val(),
                    cty: $(".city_signup").val(),
                    stAd: $(".streetAddress_signup").val(),
                },
            },
            type: "reg"
        }

        // send to server and login user
        var url = "";
        $.post(url, user_data, function(data, status){
            if(data.message == "Successful"){
                
                // Log User in
                var usr_ = data.usr; var u_e = usr_.eml; var u_p = usr_.pss; var k_ = usr_.ky
                m_.auth().signInWithEmailAndPassword(u_e, u_p);

                // Store usr plylsts
                State.usr_ = {playlists: usr_.dta, ky:k_};

                // Change lgn State
                State.lgn_sts = true;

                // Close Widget and Change Header Text 
                $(".registeruser_cont_").remove();
                $(".explain_page").text("Retrieving your Playlists.");

                // Show Spinner for 3secs
                $(".sign_lgn_backg_cont").append(`<div class="mk-spinner-centered mk-spinner-ring"></div>`)

                // Remove after 3sec
                return setTimeout(function(){
                    // Remove Spinner and Append Users Login Details
                    $(".explain_page").text("")
                    $(".mk-spinner-centered").remove();
                    $(".sign_lgn_backg_cont").append(`<div class="user_name_"><span class="txt_blden">Your Username is: </span>`+u_e+`</div>`);
                }, 3000);
            }
        })
        // Error Callback
        .catch(function (){
            return alert("Error Registering Account, Please Refresh and Try again!")
        });

    },
    lgn_in:function(e_ls, p_ls){

        // if container not Visible then display it
        var empty_cont = `<div class="sign_lgn_backg_cont _loginform_"><div class="explain_page"></div></div>`;
        ( $(".App_Root").find(".sign_lgn_backg_cont").length == 1) ? null : $(".App_Root").append(empty_cont);

        // Vals
        var eml_ = ( e_ls != undefined)? e_ls:$(".usr_lgn_").val(); var pss_ = ( p_ls!= undefined)? p_ls:$(".pss_lgn_").val();

        // Log user in
        m_.auth().signInWithEmailAndPassword(eml_, pss_).then(()=>{
            // Close lgn widget
            $("._loginform_cont_p").remove();
    
            // Append Spinner
            $(".App_Root").append(` <div class="spinner_container"><div class="mk-spinner-centered mk-spinner-ring"></div>
            <div class="spin_text">Loading Playlists...</div></div>`);
    
            // data object
            var _data_ = {
                email: eml_,
                pass: pss_,
                type: "lgn"
            }
            
            // Get Playlists
            var url = "";
            
            return $.post(url, _data_, function(data, status){
                // Save Playlists
                if(data.message == "Successful"){
                    // Save playlists
                    var usr_ = data.usr;    var k_ = usr_.ky
                    State.usr_ = {playlists: usr_.dta, ky:k_};
                    State.lgn_sts = true;
                    localStorage.setItem("amrts", JSON.stringify({playlists: usr_.dta, eml:eml_, pss:pss_}))
                    
                    // Close sgn in container
                    setTimeout(function() {
                        $(".spinner_container").remove()
                        $(".sign_lgn_backg_cont").remove();
                    }, 3000);
                }
                else{
                    $(".sign_lgn_backg_cont").append(`
                    <div class="getpl_err_hdr">GET Error!</div>
                    <div class="auth_error">Error Occured whilst trying to retrieve your playlists</div>
                    `)
                    // alert("Error Occured whilst trying to retrieve your playlists");
                }
            })

        })
        // If Error In Log-In
        .catch(error=>{
            
            // Error Types
            var errorType = { pasword_err: "auth/wrong-password", no_user_found: "auth/user-not-found", invalid_email: "auth/invalid-email"};

            // Alert message to user
            switch(error.code){
                case errorType.pasword_err:
                    // Remove Past error message
                    $(".pass_err").remove();    $(".user_err").remove();    $(".email_err").remove();

                    return $(".pss_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                        $(".reguser_form_cornt_webapp").append(`<div class="auth_error pass_err">Oops! invalid password</div>`)
                
                case errorType.invalid_email:
                    // Remove Past error message
                    $(".email_err").remove();   $(".user_err").remove();    $(".user_err").remove();

                    return $(".usr_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                        $(`<div class="auth_error email_err">Oops! Invalid Email/Username</div>`).insertAfter(".usr_lgn_")
                    
                case errorType.no_user_found:
                    // Remove Past error message
                    $(".user_err").remove();        $(".email_err").remove();           $(".pass_err").remove();

                    return $(".pss_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                        $(".usr_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                        $(`<div class="auth_error user_err">Oops! No matching User Found!</div>`).insertAfter(".reguser_form_cornt_webapp")
            }
        });


    },
    rg_val:function(type){
        // Validation no Empty Fields
        if(type == "rg"){
            if( $(".first_sgnup").val() != "" && $(".lastnme_sgnup").val() != "" && $(".date_sgnup_").val() != "" && $(".cellphone_sgnup").val() != "" && $(".country_origin_").val() != "" && $(".city_signup").val() != "" &&  $(".streetAddress_signup").val() != "" &&  $(".gender_").val() != ""){ 
                // Remove any errors
                $(".auth_error").remove();

                // if either email || phone is selected as logn type
                if(  $(".email_userreg_landing").val() != "" || $(".phone_userreg_landing").val() != ""  ){
                    
                    // Remove Any Auth Error Messages
                    $(".auth_error").remove()
                    
                    // Validation Rules
                    var email_val = /^.+@[^\.].*\.[a-z]{2,}$/;      var username_val = /[0-9a-zA-Z]{6,}/;    var pass_val = /[0-9a-zA-Z]{6,}/;   var phone_val = /[0-9a-zA-Z]{6,}/;  var val_state = 0; // 3/3 for success

                    // Validate Username
                    if(username_val.test( $(".first_sgnup").val()  )){  val_state++ }  else{  $(`<div class="auth_error">Username must be atleast 6 chracters</div>`).insertAfter(".first_sgnup");  $(".first_sgnup").addClass("field_incomplete")   }; // Username
                    
                    // Validate Password
                    if(username_val.test( $(".lastnme_sgnup").val()  )){  val_state++ }  else{  $(`<div class="auth_error">Password must be atleast 6 chracters</div>`).insertAfter(".lastnme_sgnup");  $(".lastnme_sgnup").addClass("field_incomplete")   }; // Username
                    
                    // Validate second number
                    if( phone_val.test( $(".cellphone_sgnup").val() )){ val_state++ } else {  $(`<div class="auth_error">Telephone should have 11 digits!</div>`).insertAfter(".cellphone_sgnup");   $(".cellphone_sgnup").addClass("field_incomplete")  }  //Cellphone
                    
                    // Validite Email
                    if($(".email_userreg_landing").css("display") != "none"){
                        if(email_val.test( $(".email_userreg_landing").val() )){  val_state++ }  else{  $(`<div class="auth_error">Incorrect Email Format</div>`).insertAfter(".email_userreg_landing");  $(".email_userreg_landing").addClass("field_incomplete")   }; // Email
                    }
                    // Validate Phone
                    else if(    $(".phone_userreg_landing").css("display") != "none"    ){
                        if(phone_val.test(   $(".phone_userreg_landing").val()   )){  val_state++ }  else{  $(`<div class="auth_error">Telephone should have 11 digits!</div>`).insertAfter(".phone_userreg_landing");  $(".phone_userreg_landing").addClass("field_incomplete")  }; // Phone
                    };
                    console.clear()
                    console.log(val_state)

                    // Success the Proceed
                    if(val_state == 4){
                        return Lib.sgn_reg()
                    }
                    else{
                    }
                }else{
                    // if Email missing
                    if(  $(".phone_userreg_landing").val() == "" && $(".email_userreg_landing").css("display") == "none" ){
                        // Highlight form && Alert User
                        $(".phone_userreg_landing").addClass("field_incomplete");
                        $(`<div class="auth_error">Phone number missing!</div>`).insertAfter(".phone_userreg_landing")
                    }
                    // if Phone missing
                    else if(  $(".email_userreg_landing").val()  == "" && $(".phone_userreg_landing").css("display") == "none" ){
                        // Highlight form && Alert User
                        $(".email_userreg_landing").addClass("field_incomplete");
                        $(`<div class="auth_error">Email number missing!</div>`).insertAfter(".email_userreg_landing")
                    }
                }
            }
            else{
                $(`<div class="auth_error">Missing Information! Please ensure all fields have been filled.</div>`).insertAfter(".reguser_form_cornt_webapp")
                // return alert("Missing Information! Please ensure all fields have been filled.")
            }
        }
        else if( type == "lgn"){
            if(     $(".usr_lgn_").val() != "" && $(".pss_lgn_").val() != "" && $(".usr_lgn_").val().includes("@") == true  && $(".usr_lgn_").val().includes(".") == true  ){
                return Lib.lgn_in()
            }else{
                return alert("Your email is not in correct format!")
            }
        }
    },
    pl_mkp:function(){
        var output = `
            <div class="playlist_Container">
                <h1 class="playlst_cont_header">Your Playlists</h1>
                <div class="playlists_section">`+this.create_pl_mkup()+`</div>
            </div>
        `;
        return output
    },
    playlists: function(){
        // Get Visibility
        var visibility = $(".App_Root").find(".playlist_Container").length;

        // Render Playlists function
        var play_rendr = function(){
            // Container markup
            var markup = Lib.pl_mkp();
            // Render Container
            $(".App_Root").append(markup)
            // Close Queue if Open
            $(".q_cont_sngs").remove()
            // Get Playlists
            var playlists = Object.values(State.usr_.playlists);
            // Map thru Playlists and render
            return playlists.map(function(playlist, indx){
                if(playlist.playlistName != undefined){
                    var pl_mkup = Lib.pl_item_mkup(playlist.playlistName);
                    
                    if(playlist.playlistName == "My Songs"){
                        $(pl_mkup).insertBefore( "#create_newpl" ).addClass("_mySongsPL")
                    }else{$(pl_mkup).insertBefore( "#create_newpl" )}
                }
            })
        }
        
        
        // Toggle visibility
        if(visibility < 1){
            return play_rendr()
        }
        else if(visibility >= 1){
            return $(".playlist_Container").remove()
        }
    },
    pl_item_mkup:function(pl_name){
        var output = `
            <div class="pl_item_user" title="`+pl_name+`" onclick="opn_pl(this)">
                <img class="pl_icon_user" src="./../../assets/icons/playlist.png">
                <span class="pl_name_user_ playlist">`+pl_name+`</span>
            </div>
        `;
        return output
    },
    create_pl_mkup:function(){
        var output = `
            <div class="create_newpl" id="create_newpl" title="Create new Playlist" onclick="cr_pl()">
                <img class="pl_icon_user_create" src="./../../assets/icons/plus.png">
                <span class="pl_name_user_ playlist">New Playlist</span>
            </div>
        `;
    return output
    }, 
    createpl:function(){
        // Markup
        var markup = this.createpl_container();
        // Append Container
        return $(".App_Root").append(markup)
    },
    createpl_container:function(){
        var output = `
            <div class="sign_lgn_backg_cont _loginform_">
                    <div class="createpl_form">
                        <h1 class="reg_user_hdr_land_">Create Playlist</h1>
                        <section class="fields_createpl">
                            <input class="create_field pl_name_field" placeholder="Playlist Name">
                            <textarea class="create_field pl_descript_field" placeholder="Description of playlist"></textarea>
                        </section>
                        <div class="btn_container_reguser">
                            <button class="sign_btn_reguser_login ripple" onclick="create()">Create</button>
                        </div> 
                    </div>
                    <button class="cls_sgn_lgn_create ripple" onclick="c_lgnsgn()">Close</button>
            </div>
        `;
        return output
    },
    postPL:function(){
        // Playlist Object
        var pl = {
            description: $(".pl_descript_field").val().trim(),
            playlistName: $(".pl_name_field").val().trim(),
            songs:{songs: "appended here"} 
        }
        // Upload to DB
        m_.database().ref("Users/"+State.usr_.ky+"/playlists").push(pl).then(function(){
            m_.database().ref("Users/"+State.usr_.ky+"/playlists").once("value", function(snap){
                State.usr_.playlists = snap.val();
                Lib.playlists()
            })
        })
        // Close Widget
        return  $(".sign_lgn_backg_cont").remove();
    },
    signout:function(){
        alert("Signed Out")
    }
}

// opn lib
var lb_ = function(){
    return Lib.opn()
}
// open sgn up form
var sgnup = function(){
    return Lib.sgn_up()
}
// open lgn form
var lgn = function(){
    return Lib.lgn()
}
// close lgn widget
var c_lgnsgn = function(){
    return Lib.cls()
}
// reg finish
var sgn = function(){
    return Lib.rg_val("rg")
}
// finish lgn
var lg_n = function(){
    return Lib.lgn_in()
}
// open pl
var opn_pl = function(param){
    return Pages.render_page("usr_playlist", param)
}
// cr_pl
var cr_pl = function(){
    return Lib.createpl()
}
// postPL to DB
var create = function(){
    return Lib.postPL()
}
var signout = function(){
    return Lib.signout()
}