
function storageFactory() {
    var inMemoryStorage = {};
  
    function getStorage () {
      if ("localStorage" in window) {
        return localStorage;
      }
    }
  
    function isSupported() {
      try {
        const testKey = "random-key";
        getStorage().setItem(testKey, testKey);
        getStorage().removeItem(testKey);
        console.log("localStorage is supported");
        return true;
      } catch (e) {
        console.log("localStorage is not supported");
        $('#cookies_banner_div').attr("hidden", false);
        var divs = document.getElementsByClassName('chat-logs');
        for(var i=0; i < divs.length; i++) { 
        divs[i].style.height = '420px';
        }
        return false;
      }
    }
  
    function clear() {
      if (isSupported()) {
        getStorage().clear();
      } else {
        inMemoryStorage = {};
      }
    }
  
    function getItem(name) {
      if (isSupported()) {
        return getStorage().getItem(name);
      }
      if (inMemoryStorage.hasOwnProperty(name)) {
        return inMemoryStorage[name];
      }
      return null;
    }
  
    function key(index) {
      if (isSupported()) {
        return getStorage().key(index);
      } else {
        return Object.keys(inMemoryStorage)[index] || null;
      }
    }
  
    function removeItem(name) {
      if (isSupported()) {
        getStorage().removeItem(name);
      } else {
        delete inMemoryStorage[name];
      }
    }
  
    function setItem(name, value) {
      if (isSupported()) {
        getStorage().setItem(name, value);
      } else {
        inMemoryStorage[name] = String(value);
      }
    }
  
    function length() {
      if (isSupported()) {
        return getStorage().length;
      } else {
        return Object.keys(inMemoryStorage).length;
      }
    }
  
    return {
      "getItem": getItem,
      "setItem": setItem,
      "removeItem": removeItem,
      "clear": clear,
      "key": key,
      "length": length
    };
  }

function chatbot() {
    window.__bot = {};
    console.log("URL :", window.location.href);
    window.__bot.lStorage = storageFactory();
    window.__bot.url_prefix = "/chat/web/bot/";
    window.__bot.getUrlParams = function(url, name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
        if (results==null) {
           return null;
        }
        return decodeURI(results[1]) || 0;
    }   
    try{
        window.__bot.web_uid = new URL(window.location.href).searchParams.get("web_uid");
        window.__bot.host_parent = new URL(window.location.href).searchParams.get("host_parent");
        window.__bot.host_backend = new URL(window.location.href).searchParams.get("host_backend");
        console.log("no error with search params")
           }
    catch (err){
        console.log("error with search params",err);
        window.__bot.web_uid = window.__bot.getUrlParams(new URL(window.location.href),"web_uid");
        window.__bot.host_parent = window.__bot.getUrlParams(new URL(window.location.href),"host_parent");
        window.__bot.host_backend = window.__bot.getUrlParams(new URL(window.location.href),"host_backend"); 
    }

    window.__bot.server_host = new URL(window.__bot.host_backend).host;
    window.__bot.session_uid = window.__bot.lStorage.getItem("__bot_session_uid_" + window.__bot.web_uid);
    console.log("get = ",window.__bot.session_uid )

    console.log("SERVER HOST :", window.__bot.server_host);
    window.__bot.server_host_http = window.__bot.host_backend;
    window.__bot.server_host_ws = "ws" + (new URL(window.__bot.host_backend).protocol == "http:" ? "" : "s") + "://" + window.__bot.server_host;
    window.__bot.ws_connect = function (res, rej) {
        window.__bot.default_disconnect = false;
        if (!window.__bot.session_uid) {
            res(false);
            return;
        }
        var WS_URL = window.__bot.server_host_ws + "/ws/web/bot/session_id/" + window.__bot.session_uid + "/index_test/";
        console.log(WS_URL);
        window.__bot.ws = new WebSocket(WS_URL);
        window.__bot.ws.onopen = function () {
            console.log("Connected to", WS_URL);
            res(true);
        };
        window.__bot.ws.onclose = function () {
            // window.__bot.initiated_ws = false;
            console.log("DisConnected to", WS_URL);
            if (!window.__bot.default_disconnect && window.__bot.ws.readyState ==3) {
                new Promise(window.__bot.ws_connect);
            }
        };
        window.__bot.ws.onmessage = function (data) {
            console.log("message recieved", data);
            let response = JSON.parse(data.data);

            console.log("INTENT: ", response.intent);
            console.log("ACTION: ", response.action);
            let response_messages = response.response_messages;
            setTimeout(function () {
                if (response.type === "voice") {
                    let input_message = response.input_message;
                    // window.__bot.generate_message(input_message, "self");
                    if(input_message !== "")
                    {
                        if(input_message==="Sorry.. Unable to Recognize Please Retry"){
                            window.__bot.hide_voice_recognizing_indicator();
                            var template_text = document.getElementById("template_text").innerHTML;
                            var rendered_text = Mustache.render(template_text, {
                                text: input_message,
                            });
                            window.__bot.generate_message(rendered_text, "user");
                            window.__bot.awaiting_response = false;
                        }
                        else{
                            window.__bot.process_input(input_message, undefined);
                            
                            // window.__bot.show_typing_indicator();
                        }
                    }
                    // let audio_content = response.audio_content;
                    // window.__bot.play_blob_data(audio_content);
                }
                else{

                window.__bot.process_messages(response_messages, false, 0);
                console.log("end of conv", response.end_conversation);
                if (response.end_conversation) {
                    window.__bot.disable_chat_log();
                    window.__bot.disable_text_input();
                }
            }
            }, 1);
        };
    };
    window.__bot.ws_send = function (message , display_text) {
        window.__bot.chat_form_hide(null);
        if (message instanceof Blob) {  
            window.__bot.ws.send(message);
        } else {
            var payload = {
                input_message: message,
                display_text: display_text
            };
            window.__bot.stop_blob_data();
            window.__bot.show_typing_indicator();
            window.__bot.ws.send(JSON.stringify(payload));
        }
    };

    window.__bot.disable_text_input = function () {
        $("#chat-input").attr("disabled", true);
        $("#chat-input").addClass("disabled_element");
        $("#chat-submit").addClass("disabled_element");
        $("#recordButton").addClass("disabled_element");
    };
    window.__bot.enable_text_input = function () {
        $("#chat-input").attr("disabled", false);
        $("#chat-input").removeClass("disabled_element");
        $("#chat-submit").removeClass("disabled_element");
        $("#recordButton").removeClass("disabled_element");
    };
    window.__bot.disable_reset_chat = function () {
        $("#chat-box-delete").addClass("disabled_element");
    };
    window.__bot.enable_reset_chat = function () {
        $("#chat-box-delete").removeClass("disabled_element");
    };
    window.__bot.disable_quick_replies = function () {
        $(".replies_container_div").addClass("disabled_element");
    };

    window.__bot.disable_chat_log = function () {
        $(".chat-msg").addClass("disabled_element");
    };

    window.__bot.show_typing_indicator = function () {
        window.__bot.hide_typing_indicator();
        window.__bot.hide_voice_recognizing_indicator();
        var template = document.getElementById("template_typing").innerHTML;
        var rendered = Mustache.render(template, {});
        $(".chat-logs").append(rendered);
    };
    window.__bot.hide_typing_indicator = function () {
        $(".chat-logs").find(".loading").remove();
    };

    window.__bot.show_voice_recognizing_indicator = function () {
        window.__bot.hide_voice_recognizing_indicator();
        var template = document.getElementById("voice_recognizing").innerHTML;
        var rendered = Mustache.render(template, {});
        $(".chat-logs").append(rendered);
    };
    window.__bot.hide_voice_recognizing_indicator = function () {
        $(".chat-logs").find(".loading").remove();
    };

    window.__bot.pre_init = function () {
        let params = {
            web_uid: window.__bot.web_uid,
        };
        fetch(window.__bot.server_host_http + window.__bot.url_prefix + "info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                // from database
                window.__bot.display_name = data.display_name;
                window.__bot.bot_type = data.bot_type;
                window.__bot.text_color = data.color_code_text;
                window.__bot.theme_color = data.color_code_theme;
                window.__bot.bot_icon = data.bot_icon;

                // from query_params
                try{
                if (new URL(window.location.href).searchParams.get("display_name")) {
                    window.__bot.display_name = new URL(window.location.href).searchParams.get("display_name");
                }
                if (new URL(window.location.href).searchParams.get("bot_type")) {
                    window.__bot.bot_type = new URL(window.location.href).searchParams.get("bot_type");
                }
                if (new URL(window.location.href).searchParams.get("text_color")) {
                    window.__bot.text_color = "#" + new URL(window.location.href).searchParams.get("text_color");
                }
                if (new URL(window.location.href).searchParams.get("theme_color")) {
                    window.__bot.theme_color = "#" + new URL(window.location.href).searchParams.get("theme_color");
                }
                if (new URL(window.location.href).searchParams.get("bot_icon")) {
                    window.__bot.bot_icon = atob(new URL(window.location.href).searchParams.get("bot_icon"));
                }
            }
            catch (err){
                console.log()
            }
                // display_name
                document.getElementById("chat-with-text").innerHTML =
                    "&nbsp;ASK " + (window.__bot.display_name.length < 8 ? window.__bot.display_name : "ME");
                document.getElementById("bot_name").innerHTML = window.__bot.display_name;
                // bot_type
                // $("#recordButton").hide();
                $("#recordButton").addClass("disabled_element");

                if (window.__bot.bot_type == "voice") {
                    // $("#recordButton").show();
                    $("#recordButton").removeClass("disabled_element");

                }
                // text_color + theme_color
                console.log(window.__bot.theme_color);
                console.log(window.__bot.text_color);
                // document.styleSheets[3].cssRules[1].style.setProperty("--main-bg-color", window.__bot.theme_color);
                // document.styleSheets[3].cssRules[1].style.setProperty("--main-text-color", window.__bot.text_color);

                // bot_icon
                if (!window.__bot.bot_icon) {
                    window.__bot.bot_icon =
                        "data:image/jpeg;base64,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";
                }
                var template_bot_icon = document.getElementById("template_bot_icon").innerHTML;
                var rendered_bot_icon = Mustache.render(template_bot_icon, {
                    bot_icon: window.__bot.bot_icon,
                });
                document.getElementById("chat_icon").innerHTML = rendered_bot_icon;

                // brand
                var template_powered_by = document.getElementById("template_powered_by").innerHTML;
                var rendered_powered_by = Mustache.render(template_powered_by, { brand_display_name: "Pihu.ai" });
                document.getElementById("powered_by").innerHTML = rendered_powered_by;
                // document.getElementById("built_by").innerHTML = "Developed by Alumnus of IIPS, DAVV";

                // show chat icon
                $("#chat-circle-container").css("display", "flex");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    window.__bot.service_init_main = function () {
        let params = {
            web_uid: window.__bot.web_uid,
        };
        if (window.__bot.session_uid) {
            params.session_uid = window.__bot.session_uid;
        }
        return fetch(window.__bot.server_host_http + window.__bot.url_prefix + "web_uid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
    };

    window.__bot.service_delete_history = function () {
        var params = {
            web_uid: window.__bot.web_uid,
            session_uid: window.__bot.session_uid,
        };
        return fetch(window.__bot.server_host_http + window.__bot.url_prefix + "delete_history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
    };

    window.__bot.service_mail_history = function (params) {
        return fetch(window.__bot.server_host_http + window.__bot.url_prefix + "mail_history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
    };

    window.__bot.service_appointment_new = function (params) {
        return fetch(window.__bot.server_host_http + window.__bot.url_prefix + "appointment/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
    };

    window.__bot.service_appointment = function (params) {
        return fetch(window.__bot.server_host_http + window.__bot.url_prefix + "appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
    };

    window.__bot.toggle_chatui = function () {
        $("#chat-circle-container").toggle("scale");
        $(".chat-box").toggle("scale");
    };

    window.__bot.scroll_to_bottom = function () {
        $(".chat-logs")
            .stop()
            .animate(
                {
                    scrollTop: $(".chat-logs")[0].scrollHeight,
                },
                1000
            );
    };
    window.__bot.scroll_to_top = function () {
        $(".chat-logs").stop().animate(
            {
                scrollTop: 0,
            },
            200 
        );
    };

    window.__bot.process_messages = function (response_messages, is_history, index) {
        window.__bot.chat_form_hide(null);
        setTimeout( 
            function () {
                window.__bot.hide_typing_indicator();
                response_message = response_messages[index];
                if (response_messages.length === 0  || response_message[0] == ""){
                    // ignore empty string messages
                } else if (response_message[0]) {
                    window.__bot.generate_message(response_message[0], "self");
                } else {
                    console.log(response_message);
                    final_message = "";
                    if (["text", "quick_reply", "link", "form"].indexOf(response_message.type) != -1) {
                        (response_message.content.text || []).map(function (text) {
                            var template_text = document.getElementById("template_text").innerHTML;
                            var rendered_text = Mustache.render(template_text, {
                                text: text,
                            });
                            final_message += rendered_text;
                        });

                        if (response_message.type == "quick_reply") {
                            final_replies = "";
                            response_message.content.replies.map(function (reply) {
                                    reply_display_text = reply.display_text || reply;
                                    reply_slug = reply.slug || reply_display_text ;
                                var template_quick_reply_replies = document.getElementById("template_quick_reply_replies").innerHTML;
                                var rendered_replies = Mustache.render(template_quick_reply_replies, {
                                    reply_display_text: reply_display_text,
                                    reply_slug: reply_slug,
                                });
                                final_replies += rendered_replies;
                            });
                            var template_quick_reply = document.getElementById("template_quick_reply").innerHTML;
                            var rendered_quick_reply = Mustache.render(template_quick_reply, {
                                rendered_replies: final_replies,
                            });
                            final_message += rendered_quick_reply;
                        }

                        if (response_message.type == "link") {
                            response_message.content.links.map(function (link) {
                                var template_links = document.getElementById("template_links").innerHTML;
                                var rendered_links = Mustache.render(template_links, {
                                    link: link,
                                });
                                final_message += rendered_links;
                            });
                        }

                        if (response_message.type == 'form' && is_history == false) {
                            var form = response_message.content;
                            if(form.name == "auth_form" && window.__bot.auth_form_email && window.__bot.auth_form_password){
                                window.__bot.chat_form_action("auth_form", "submit");
                            }else{
                                var template_form_container = document.getElementById("template_form_container").innerHTML;
                                var template_form = document.getElementById("template_form").innerHTML;
                                var template_form_field_text = document.getElementById("template_form_field_text").innerHTML;
                                var template_form_field_email = document.getElementById("template_form_field_email").innerHTML;
                                var template_form_field_textarea = document.getElementById("template_form_field_textarea").innerHTML;
                                var template_form_field_password = document.getElementById("template_form_field_password").innerHTML;
                                var template_form_field_select = document.getElementById("template_form_field_select").innerHTML;
                                var template_form_field_select_option = document.getElementById("template_form_field_select_option").innerHTML;
                                var template_form_field_file_pdf = document.getElementById("template_form_field_file_pdf").innerHTML;
                                var template_form_field_calendar_container = document.getElementById("template_form_field_calendar_container").innerHTML;
                                var rendered_fields = form.fields.map(function(field){
                                    if(field.type == "text"){
                                        var rendered_field = Mustache.render(template_form_field_text, {
                                            "form_name": form.name,
                                            "field": field
                                        });
                                    }else if(field.type == "email"){
                                        var rendered_field = Mustache.render(template_form_field_email, {
                                            "form_name": form.name,
                                            "field": field
                                        });
                                    }else if(field.type == "textarea"){
                                        var rendered_field = Mustache.render(template_form_field_textarea, {
                                            "form_name": form.name,
                                            "field": field
                                        });
                                    }else if(field.type == "password"){
                                        var rendered_field = Mustache.render(template_form_field_password, {
                                            "form_name": form.name,
                                            "field": field
                                        });
                                    }else if(field.type == "select"){
                                        var options = field.options.map(function(option){
                                            return Mustache.render(template_form_field_select_option, {
                                                "option": option
                                            });
                                        })
                                        var rendered_options = options.join("");
                                        var rendered_field = Mustache.render(template_form_field_select, {
                                            "form_name": form.name,
                                            "field": field,
                                            "options": rendered_options
                                        });
                                    }else if(field.type == "file_pdf"){
                                        var rendered_field = Mustache.render(template_form_field_file_pdf, {
                                            "form_name": form.name,
                                            "field": field
                                        });
                                    }else if(field.type == "calendar"){
                                        var rendered_field = Mustache.render(template_form_field_calendar_container, {});

                                        var data = {};
                                        data.session_uid = window.__bot.session_uid;
                                        data.web_uid = window.__bot.web_uid;
                                        console.log(data);
                                        window.__bot.service_appointment_new(data).then(function (response) {
                                            return response.json();
                                            })
                                            .then(function (data) {
                                                console.log(data);
                                                window.__bot.calendar_days = data.data.microsoft_calender_integration.dates;
                                                window.__bot.calendar_counter_day = 0;
                                                window.__bot.calendar_counter_time_slot = 0;
                                                window.__bot.calendar_generate(null);
                                                // window.__bot.appointment_form_users = data.data.microsoft_calender_integration.users;
                                                // window.__bot.appointment_form_reset();
                                                // $("#appointmentModal").modal("show");
                                            });
                                    }else{
                                        return "";
                                    }
                                    return rendered_field;
                                });
                                var rendered_form = Mustache.render(template_form,{
                                    name: form.name,
                                    fields: rendered_fields.join("")
                                });
                                var rendered_form_container = Mustache.render(template_form_container,{
                                    form: rendered_form
                                });
                                final_message += rendered_form_container;
                            }
                        }
                    }
                    if (final_message) {
                        // window.__bot.disable_quick_replies();
                        window.__bot.generate_message(final_message, "user");
                    }
                }
                if (response_messages[index + 1]) {
                    window.__bot.show_typing_indicator();
                    window.__bot.process_messages(response_messages, is_history, index + 1);
                } else {
                    window.__bot.enable_reset_chat();
                    window.__bot.awaiting_response = false;
                }
            },
            is_history || index == 0 ? 1 : 1500
        );
    };
    window.__bot.process_input = function (msg , display_text) {
        console.log(msg,display_text)
        window.__bot.disable_reset_chat();
        // window.__bot.disable_quick_replies();
        window.__bot.awaiting_response = true;
        if (!window.__bot.ws || (window.__bot.ws && window.__bot.ws.readyState == window.__bot.ws.CLOSED)) {
            new Promise(window.__bot.ws_connect).then(function () {
                // window.__bot.initiated_ws = true;
                console.log("Promise fulfilled");
                if (!(msg instanceof Blob)) {
                    console.log("processing text input");
                    window.__bot.generate_message(display_text || msg, "self");
                }
                window.__bot.ws_send(msg, display_text);

                if (window.__bot.timeout_disconnect) {
                    clearTimeout(window.__bot.timeout_disconnect);
                }
                window.__bot.timeout_disconnect = setTimeout(function () {
                    window.__bot.default_disconnect = true;
                    window.__bot.ws.close(1000, "Disconnected after 2 minute");
                }, 60000);
            });
        } else if(window.__bot.ws.readyState ==window.__bot.ws.OPEN){
            if (!(msg instanceof Blob)) {
                window.__bot.generate_message(display_text || msg, "self");
            }
            window.__bot.ws_send(msg , display_text);
            if (window.__bot.timeout_disconnect) {
                clearTimeout(window.__bot.timeout_disconnect);
            }
            window.__bot.timeout_disconnect = setTimeout(function () {
                window.__bot.default_disconnect = true;
                window.__bot.ws.close(1000, "Disconnected after 2 minute");
            }, 60000);
        }
    };
    window.__bot.generate_message = function (msg, type) {
        let profile_image;
        if (type == "self") {
            profile_image = '<i class="material-icons" id="user_icon">account_circle</i>';
        } else {
            if (window.__bot.bot_icon) {
                profile_image = '<img src="' + window.__bot.bot_icon + '">';
            } else {
                profile_image =
                    '<img src="data:image/jpeg;base64,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"style="width:30px;height:30px;border-radius:50%">';
            }
        }

        window.__bot.INDEX++;
        var str = "";
        var template_chat = document.getElementById("template_chat").innerHTML;
        var rendered_chat = Mustache.render(template_chat, {
            INDEX: window.__bot.INDEX,
            type: type,
            msg: msg,
            profile_image: profile_image,
        });
        str += rendered_chat;

        $(".chat-logs").append(str);
        $("#cm-msg-" + window.__bot.INDEX)
            .hide()
            .fadeIn(300);
        if (type == "self") {
            $("#chat-input").val("");
        }
        if ($(".chat-logs")[0].children.length == 1) {
            window.__bot.scroll_to_bottom();
            window.__bot.scroll_to_top();
        } else {
            window.__bot.scroll_to_bottom();
        }
    };
    

    return window.__bot;
}
