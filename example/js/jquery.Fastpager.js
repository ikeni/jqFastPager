
!(function ($) {
    "use strict";
    $.extend({
        fastpager : new function (options) {
            var fp = this;
            fp.version = "1.0";
            fp.defaults = {
                pageSize: 10,
                currentPage: 1,
                pagerLocation: "after",
                nav_show_first_last : true,
                nav_show_next_previous : true,
                nav_show_all_page : false,
                nav_show_number_first_page : 3,
                nav_show_number_last_page : 3,
                nav_show_number_middle_page : 2,
                debug : false
            };
            fp.options = {
                
            };
            
            /* benchmark */
			function benchmark(text, time) {
				console.log(text + " (" + (new Date().getTime() - time.getTime()) + "ms)");
			}
            
            function processorTable(selector, options) {
                var pageCounter = 1;
                selector.children('tbody').children('tr').each(function (i) {
                    if (i < pageCounter * options.pageSize && i >= (pageCounter - 1) * options.pageSize) {
                        $(this).addClass(CLASSES.pagerNav + pageCounter);
                    } else {
                        $(this).addClass(CLASSES.pagerNav + (pageCounter + 1));
                        pageCounter++;
                    }
                });
                return pageCounter;
            }
            
            function processorList(selector, options) {
                var pageCounter = 1;
                selector.children().each(function (i) {
                    if (i < pageCounter * options.pageSize && i >= (pageCounter - 1) * options.pageSize) {
                        $(this).addClass(CLASSES.pagerNav + pageCounter);
                    } else {
                        $(this).addClass(CLASSES.pagerNav + (pageCounter + 1));
                        pageCounter++;
                    }
                });
                return pageCounter;
            }
            
            function NavElmPager(obj, options) {
                var selector = $(obj);
                var hiddenPage = false;
                var pageCounter = 1;
                var time = new Date();
                
                selector.wrap("<div class='" + CLASSES.divNavigation + "'></div>");
                
                selector.parents("." + CLASSES.divNavigation).find("ul." + CLASSES.pagerNav).remove();
                
                if (selector.is("ul")) {
                    pageCounter = processorList(selector, options);
                } else if (selector.is("table")) {
                    pageCounter = processorTable(selector, options);
                } else {
                    pageCounter = processorList(selector, options);
                }
                
                // show/hide the appropriate regions
                selector.find("[class^='" + CLASSES.pagerNav + "']").css({'display' : 'none'});
                selector.find("." + CLASSES.pagerNav + options.currentPage).css({'display' : ''});
                if (pageCounter <= 1) {
                        return;
                }

                //Delete old pagerNav
                selector.find("ul." + CLASSES.pagerNav).remove();
                
                var currentPageInt = parseInt(options.currentPage, 10);
                
                var pageNav = "<ul class='" + CLASSES.pagerNav + "'>";
                if (options.nav_show_first_last) {
                    pageNav += "<li class='" + CLASSES.firstPageNav;
                    if (currentPageInt === 1) {
                        pageNav += " "+CLASSES.disabledNav;
                    }
                    pageNav += "'><a rel='" + 1 + "' href='#'>" + "First" + "</a></li>";
                }
                if (options.nav_show_next_previous) {
                    var previous = 0;
                    if (options.currentPage > 1) {
                        previous = parseInt(options.currentPage, 10) - 1;
                    } else {
                        previous = parseInt(options.currentPage, 10);
                    }
                    pageNav += "<li class='" + CLASSES.previousPageNav;
                    if (currentPageInt === 1) {
                        pageNav += " "+CLASSES.disabledNav;
                    }
                    pageNav += "'><a rel='" + previous + "' href='#'>" + "&lt;" + "</a></li>";
                }
                
                for (var i=1; i<=pageCounter; i++){
                    //Show all page in pager
                    if (options.nav_show_all_page) {
                        if (i==currentPageInt) {
                                pageNav += "<li class='" + CLASSES.currentPage + " " + CLASSES.pageNav+"'><a rel='" + i + "' href='#'>" + i + "</a></li>";        
                        }
                        else {
                                pageNav += "<li class='" + CLASSES.pageNav + "'><a rel='" + i + "' href='#'>" + i + "</a></li>";
                        }
                    }
                    //Show partial page in pager
                    else  {
                        if (i===currentPageInt) {
                            pageNav += "<li class='"+CLASSES.currentPage+" "+CLASSES.pageNav+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";        
                        } else if(i <= options.nav_show_number_first_page || i > pageCounter - options.nav_show_number_first_page ) {
                            pageNav += "<li class='"+CLASSES.pageNav+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";
                            hiddenPage = false;
                        } else if( i >= currentPageInt - options.nav_show_number_middle_page && i <= currentPageInt + options.nav_show_number_middle_page) {
                            pageNav += "<li class='"+CLASSES.pageNav+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";
                            hiddenPage = false;
                        } else if (!hiddenPage && (i < currentPageInt - options.nav_show_number_middle_page || i > currentPageInt + options.nav_show_number_middle_page)) {
                            hiddenPage = true;
                            pageNav += "<li class='"+CLASSES.pageNav+"'><span>...</span></li>";
                        }
                    }
                }
                if(options.nav_show_next_previous) {
                    var next = 0;
                    if(currentPageInt < pageCounter) {
                        next = parseInt(options.currentPage) + 1;
                    } else {
                        next = parseInt(options.currentPage);
                    }
                    pageNav += "<li class='"+CLASSES.nextPageNav;
                    if (pageCounter === currentPageInt) {
                        pageNav += " "+CLASSES.disabledNav;
                    }
                    pageNav += "'><a rel='"+next+"' href='#'>"+"&gt;"+"</a></li>";
                }
                if(options.nav_show_first_last) {
                    pageNav += "<li class='"+CLASSES.lastPageNav;
                    if (pageCounter === currentPageInt) {
                        pageNav += " "+CLASSES.disabledNav;
                    }
                    pageNav += "'><a rel='"+pageCounter+"' href='#'>"+"Last"+"</a></li>";
                }
                pageNav += "</ul>";
                switch(options.pagerLocation)
                {
                    case "before":
                            selector.before(pageNav);
                    break;
                    case "both":
                            selector.before(pageNav);
                            selector.after(pageNav);
                    break;
                    default:
                            selector.after(pageNav);
                }
                
                
                //pager navigation behaviour
                var c = options;
                selector.parent().find("."+CLASSES.pageNav+" a, ."+CLASSES.previousPageNav+" a, ."+CLASSES.nextPageNav+" a, ."+CLASSES.firstPageNav+" a, ."+CLASSES.lastPageNav+" a").bind("click",{optClick: c}, function(event) {
                    //grab the REL attribute
                    var clickedLink = $(this).attr("rel");
                    options.currentPage = clickedLink;
                    selector.trigger("updateFastPager", options);
                    //hide and show relevant links
                    selector.find("[class^='"+CLASSES.pagerNav+"']").hide();                        
                    selector.find("."+CLASSES.pagerNav+clickedLink).show();
                    return false;
                });                
            }
            
            function pager(obj, options) {
                var $this = $(obj);
                $this.each(function() {
                    NavElmPager(obj, options);
                });   
            }
            
            function bindEvent(jqElm, options) {
                var $this = $(jqElm);
                $this.unbind("updateFastPager").bind("updateFastPager", {optClick: options}, function(event) {
                    NavElmPager(jqElm, event.data.optClick);
                });
            }
            
             //Constructeur
            fp.construct = function (settings) {
                
                return this.each(function () {
                    //Declare variable
                    var $this = $(this), obj = this;
                    var time;
                    var options =  $.extend({}, true, fp.options, fp.defaults, settings);
                    if(options.debug) {
                        time = new Date();
                    }
                    pager(obj, options);
                    bindEvent(obj, options);
                    if(options.debug) {
                        benchmark("Built complete :", time);
                    }
                });
            };
                
        }()
    });
    
    // Variable name CSS class - Modify here if you want to change the class name of elements
    var CLASSES = ({
        currentPage : "currentPage",
        divNavigation : "navigationContainer",
        pagerNav : "pagerNavigation",
        pageNav : "pageNav", 
        firstPageNav : "firstPageNav",
        previousPageNav : "previousPageNav",
        nextPageNav : "nextPageNav",
        lastPageNav : "lastPageNav",
        disabledNav : "disabledNav"
    });
    
    // make shortcut
	var fp = $.fastpager;

	// extend plugin scope
	$.fn.extend({
		fastpager: fp.construct
	});
})(jQuery);