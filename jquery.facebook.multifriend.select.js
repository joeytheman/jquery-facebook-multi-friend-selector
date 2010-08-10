(function($) { 
    var JFMFS = function(element, options) {
        var elem = $(element);
        var obj = this;
        var settings = $.extend({
            param: 'defaultValue'
        }, options || {});
                
        
        // ----------+----------+----------+----------+----------+----------+----------+
        // Initialization of container
        // ----------+----------+----------+----------+----------+----------+----------+
        elem.html(
            "<div id='jfmfs-friend-selector'>" +
            "    <div id='jfmfs-inner-header'>" +
            "        <span class='jfmfs-title'>Find Friends: </span><input type='text' id='jfmfs-friend-filter-text'/>" +
            "        <div class='jfmfs-button' id='jfmfs-filter-all'>All</div>" +
            "        <div class='jfmfs-button' id='jfmfs-filter-selected'>Selected (<span id='jfmfs-selected-count'>0</span>)</div>" +
            "    </div>" +
            "    <div id='jfmfs-friend-container'></div>" +
            "</div>" 
        );
            
        FB.api('/me/friends', function(response) {
            $.each(response.data, function(i, friend) {
                $("#jfmfs-friend-container").append("<div class='jfmfs-friend' id='" + friend.id  +"'><img src='https://graph.facebook.com/" + friend.id + "/picture' /><div class='friend-name'>" + friend.name + "</div></div>");
                init();
            });
        });
        
        
        // ----------+----------+----------+----------+----------+----------+----------+
        // Public functions
        // ----------+----------+----------+----------+----------+----------+----------+
        
        this.getSelectedIds = function() {
            var ids = [];
            $.each(elem.find(".jfmfs-friend.selected"), function(i, friend) {
                ids.push($(friend).attr("id"));
            });
            return ids;
        };
        
        // ----------+----------+----------+----------+----------+----------+----------+
        // Private functions
        // ----------+----------+----------+----------+----------+----------+----------+
        
        var init = function() {
            // handle when a friend is clicked for selection
            elem.find(".jfmfs-friend").live('click', function() {
                $(this).toggleClass("selected");
                $("#jfmfs-selected-count").html($(".selected").size());
                $(this).removeClass("hover");
            });

            // filter by selected, hide all non-selected
            elem.find("#jfmfs-filter-selected").live('click', function() {
                $(".jfmfs-friend").not(".selected").addClass("hide-non-selected");
            });

            // remove filter, show all
            elem.find("#jfmfs-filter-all").live('click', function() {
                $(".jfmfs-friend").removeClass("hide-non-selected");
            });

            // hover effect on friends
            elem.find(".jfmfs-friend:not(.selected)").live(
                'hover', function (ev) {
                    if (ev.type == 'mouseover') {
                        $(this).addClass("hover");
                    }
                    if (ev.type == 'mouseout') {
                        $(this).removeClass("hover");
                    }
                });

            // filter as you type 
            elem.find("#jfmfs-friend-filter-text")
                .keyup( function() {
                    var filter = $(this).val();
                    if(filter == '') {
                        $(".jfmfs-friend").removeClass("hide-filtered");
                    }
                    else {
                        $("#jfmfs-friend-selector").find(".friend-name:not(:Contains(" + filter +"))").parent().addClass("hide-filtered");
                        $("#jfmfs-friend-selector").find(".friend-name:Contains(" + filter +")").parent().removeClass("hide-filtered");                         
                    }    
                })
                .focus( function() {
                    if($.trim($(this).val()) == 'Start typing a name')
                        $(this).val('');
                    })
                .blur(function() {
                    if($.trim($(this).val()) == '')
                        $(this).val('Start typing a name');                        
                    });

            // hover states on the buttons        
            elem.find(".jfmfs-button").hover(
                function(){ $(this).addClass("jfmfs-button-hover");} , 
                function(){ $(this).removeClass("jfmfs-button-hover");}
            );                
            
        };
        
    };
    
    $.fn.jfmfs = function(options) {
        return this.each(function() {
            var element = $(this);
            
            // Return early if this element already has a plugin instance
            if (element.data('jfmfs')) return;
            
            // pass options to plugin constructor
            var jfmfs = new JFMFS(this, options);
            
            // Store plugin object in this element's data
            element.data('jfmfs', jfmfs);
            
        });
    };
    
    // todo, make this more ambiguous
    jQuery.expr[':'].Contains = function(a, i, m) { 
      return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
    };
        

})(jQuery);