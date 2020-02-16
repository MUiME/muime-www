var scrollable;
var bool_isclickmapwin = false;
var timeoutid;

window.addEvent('domready', function(){
    resize_area_containerprint();
    
    scrollable = new Scrollable($('area_containerprint'));
    var menuname_prev = "";
    var list_menuitem = $$('.menuitem');
    var bool_isclickmenuitem = false;
    list_menuitem.each(function(elem){
        elem.addEvents({
            'click':function(){
                bool_isclickmenuitem = true;
                
                click_menuitem(this);
                
                if(this.get('item') == "signin"){
                    window.open("/auth/", "_blank");
                }
                else{
                    var el_area_ctpaper = $('containerprint').getElement('.area_contentprint .contentprint .area_ctpaper');
                    if(el_area_ctpaper){
                        var list_el_animate = el_area_ctpaper.getElements('.animate');
                        if(list_el_animate.length > 0){
                            var animate_printcontent = function(){
                                var obj_start = {};
                                
                                list_el_animate.each(function(el_animate, i){
                                    obj_start[i] = {
                                        'top':el_animate.get('topstart').toInt(),
                                        'left':el_animate.get('leftstart').toInt(),
                                        'opacity':0
                                    };
                                });
                                
                                new Fx.Elements(list_el_animate, {
                                    duration:750
                                }).start(obj_start);
                                
                                (function(){
                                    print_content(this.get('item'), "root");
                                }).delay(250, this);
                            }.bind(this);
                            
                            if(el_area_ctpaper.hasClass('contactus')){
                                var el_iphonemap = el_area_ctpaper.getElement('.iphonemap');
                                var el_googlemap_win = el_area_ctpaper.getElement('.googlemap_win');
                                var el_googlemap_close = el_googlemap_win.getElement('.googlemap_close');
                                
                                (function(){
                                    clearTimeout(timeoutid);
                                    
                                    el_googlemap_close.fireEvent('click');
                                    (function(){ el_iphonemap.setStyle('opacity', 0); }).delay((el_googlemap_win.get('stsopen') == "1")? 800: 0);
                                    animate_printcontent.delay((el_googlemap_win.get('stsopen') == "1")? 1050: 250);
                                }).delay((el_googlemap_win.get('stsopen') == "1")? 0: 500);
                            }
                            else{
                                animate_printcontent();
                            }
                        }
                        else{
                            print_content(this.get('item'), "root");
                        }
                    }
                    else{
                        print_content(this.get('item'), "root");
                    }
                }
            }
        });
    });
    
    new Fx.Tween($('menulist'), {
        duration:1500,
        property:"opacity"
    }).start(1);
    
    (function(){
        var list_el_bgshadow = $$('.bgshadow');
        var obj_start = {};
        
        list_el_bgshadow.each(function(el_bgshadow, i){
            obj_start[i] = {'opacity':1};
        });
        
        new Fx.Elements(list_el_bgshadow, {
            duration:1500
        }).start(obj_start).chain(function(){
            if(!bool_isclickmenuitem){
                list_menuitem[0].fireEvent('click');
            }
        });
    }).delay(500);
});

window.addEvent('click', function(e){
    var el_area_ctpaper = $('containerprint').getElement('.area_contentprint .contentprint .area_ctpaper');
    if(el_area_ctpaper){
        if(el_area_ctpaper.hasClass('contactus')){
            var el_papermap1 = el_area_ctpaper.getElement('.papermap1');
            var el_iphonemap = el_area_ctpaper.getElement('.iphonemap');
            if(!bool_isclickmapwin && !e.target.hasClass('menuitem') && ![el_papermap1, el_iphonemap].contains(e.target)){
                var el_googlemap_win = el_area_ctpaper.getElement('.googlemap_win');
                var el_googlemap_close = el_googlemap_win.getElement('.googlemap_close');
                el_googlemap_close.fireEvent('click');
            }
            
            bool_isclickmapwin = false;
        }
    }
});

window.addEvent('resize', function(){
    resize_area_containerprint();
    
    var el_containerprint = $('containerprint');
    var el_contentprint = el_containerprint.getElement('.contentprint');
    var el_area_contentprint = el_containerprint.getElement('.area_contentprint');
    
    el_contentprint.setStyle('min-height', $('area_containerprint').offsetHeight);
    el_containerprint.setStyle('height', el_contentprint.offsetHeight);
    el_area_contentprint.setStyle('height', el_contentprint.offsetHeight);
});

window.addEvent('scroll', function(){
    $('bgshadow_top').setStyle('right', -window.getScroll().x);
    $('bgshadow_right').setStyle('right', -window.getScroll().x);
    $('bgshadow_bottom').setStyle('right', -window.getScroll().x);
});

var click_menuitem = (function(){
    var elprev = null;
    
    return function(el){
        if(elprev){
            elprev.removeClass('click');
        }
        el.addClass('click');
        elprev = el;
    };
})();

function resize_area_containerprint(){
    if(Browser.ie){
        $('area_containerprint').setStyle('width', $('wrapper').offsetWidth);
        $('area_containerprint').setStyle('height', $('wrapper').offsetHeight-$('area_menulist').getParent().offsetHeight);
    }
}

function print_content(menuname, clsname){
    var new_separateline = new Element('div', {
        'class':"separateline"
    }).inject($('containerprint'), "top");
    
    var new_area_contentprint = new Element('div', {
        'class':"area_contentprint"
    }).inject($('containerprint'), "top");
    
    var new_contentprint = new Element('div', {
        'class':"contentprint",
        'style':"min-height:"+$('area_containerprint').offsetHeight+"px;"
    }).inject(new_area_contentprint);
    
    var new_area_bgpaper = new Element('div', {
        'class':"area_bgpaper abs100",
        'html': '<div class="bgpaper tbl100">'+
                    '<div class="bgborderpaper tbl100_cell">&nbsp;</div>'+
                    '<div class="bgcentralpaper tbl100_cell">&nbsp;</div>'+
                    '<div class="bgborderpaper tbl100_cell">&nbsp;</div>'+
                '</div>'
    }).inject(new_contentprint);
    
    var h_ctpaper;
    if(menuname == "home"){
        if(clsname == "root"){ h_ctpaper = 524; }
    }
    else if(menuname == "product"){
        if(clsname == "root"){ h_ctpaper = /*1703*/1583; }
    }
    else if(menuname == "support"){
        if(clsname == "root"){ h_ctpaper = /*750*/1336; }
    }
    else if(menuname == "contactus"){
        if(clsname == "root"){ h_ctpaper = 524; }
    }
    
    var new_area_ctpaper = new Element('div', {
        'class':"area_ctpaper "+menuname,
        'html': '<div class="tbl100">'+
                    '<div class="tbl100_cell" style="vertical-align:middle; height:100%;">'+
                        '<div style="position:relative; height:'+h_ctpaper+'px; margin-bottom:16%;">'+
                            $('content_'+menuname).getElement("."+clsname).get('html')+
                        '</div>'+
                    '</div>'+
                '</div>'
    }).inject(new_contentprint);
    
    if(menuname == "home"){
        if(clsname == "root"){
            var el_link_product = new_area_ctpaper.getElement('.link_product');
            var el_link_support = new_area_ctpaper.getElement('.link_support');
            var el_link_signin = new_area_ctpaper.getElement('.link_signin');
            var el_link_contactus = new_area_ctpaper.getElement('.link_contactus');
            
            var list_el_menuitem = $$('.menuitem');
            el_link_product.addEvent('click', function(){ list_el_menuitem[1].fireEvent('click'); });
            el_link_support.addEvent('click', function(){ list_el_menuitem[2].fireEvent('click'); });
            el_link_signin.addEvent('click', function(){ list_el_menuitem[4].fireEvent('click'); });
            el_link_contactus.addEvent('click', function(){ list_el_menuitem[3].fireEvent('click'); });
        }
    }
    
    var h_space = (h_ctpaper >= new_contentprint.offsetHeight)? h_ctpaper: new_contentprint.offsetHeight;
    if(h_space % 97 > 0){
        h_space = h_space + ((h_space % 97 <= 49)? 49: 97) - (h_space % 97);
    }
    
    var new_space = new Element('div', {
        'class':"area_space",
        'style':"height:"+h_space+"px;"
    }).inject(new_contentprint);
    
    new Fx.Elements([$('containerprint'), new_area_contentprint], {
        duration:2000,
        onComplete:function(){
            scrollable.reposition();
            
            var list_el_animate = new_area_ctpaper.getElements('.animate');
            var obj_start = {};
            
            list_el_animate.each(function(el_animate, i){
                obj_start[i] = {
                    'top':el_animate.get('topfinish').toInt(),
                    'left':el_animate.get('leftfinish').toInt(),
                    'opacity':1
                };
            });    
            
            if(menuname == "home"){
                if(clsname == "root"){
                    var el_stampmuime = new_area_ctpaper.getElement('.stampmuime');
                    new Fx.Morph(el_stampmuime, {
                        duration:150
                    }).start({
                        'opacity':1,
                        'width':el_stampmuime.get('width').toInt()
                    }).chain(function(){
                        list_el_animate.each(function(el_animate, i){
                            new Fx.Morph(el_animate, {
                                duration:el_animate.get('duration').toInt()
                            }).start(obj_start[i]);
                        });
                    });
                }
            }
            else if(menuname == "product"){
                if(clsname == "root"){
                    var list_el_topiclistitem = new_area_ctpaper.getElements('.topiclistitem');
                    list_el_topiclistitem.each(function(el_topiclistitem){
                        el_topiclistitem.addEvent('click', function(){
                            var topic = this.get('topic');
                            $('area_containerprint').scrollTop = new_area_ctpaper.getElement('.overview.'+topic).offsetTop;
                            scrollable.reposition();
                        });
                    });
                    
                    var el_link_top = new_area_ctpaper.getElements('.link_top');
                    el_link_top.addEvent('click', function(){
                        $('area_containerprint').scrollTop = 0;
                        scrollable.reposition();
                    });
                }
            }
            else if(menuname == "contactus"){
                if(clsname == "root"){
                    var el_certified = new_area_ctpaper.getElement('.certified');
                    new Fx.Morph(el_certified, {
                        duration:150
                    }).start({
                        'opacity':1,
                        'width':el_certified.get('width').toInt()
                    }).chain(function(){
                        list_el_animate.each(function(el_animate, i){
                            new Fx.Morph(el_animate, {
                                duration:el_animate.get('duration').toInt()
                            }).start(obj_start[i]);
                        });
                    });
                    
                    var el_googlemap_win = new_area_ctpaper.getElement('.googlemap_win');
                    var el_googlemap_map = new_area_ctpaper.getElement('.googlemap_map');
                    var el_googlemap_close = new_area_ctpaper.getElement('.googlemap_close');
                    
                    el_googlemap_win.addEvent('click', function(){
                        bool_isclickmapwin = true;
                    });
                    
                    el_googlemap_close.addEvent('click', function(){
                        if(el_googlemap_win.get('stsopen') == "1"){
                            el_googlemap_map.setStyle('visibility', "hidden");
                            
                            new Fx.Elements([el_googlemap_win, el_googlemap_close], {
                                duration:1000,
                                transition:"cubic:in:out"
                            }).start({
                                0: {
                                    'top':[el_googlemap_win.get('topfinish').toInt(), el_googlemap_win.get('topstart').toInt()],
                                    'left':[el_googlemap_win.get('leftfinish').toInt(), el_googlemap_win.get('leftstart').toInt()],
                                    'width':[el_googlemap_win.get('width').toInt(), 0],
                                    'height':[el_googlemap_win.get('height').toInt(), 0]
                                },
                                1: {
                                    'opacity':0
                                }
                            }).chain(function(){
                                el_googlemap_win.setStyles({
                                    '-moz-box-shadow':"",
                                    '-webkit-box-shadow':"",
                                    'box-shadow':""
                                });
                                el_googlemap_win.setStyle('display', "none");
                                
                                el_googlemap_win.set('stsopen', "0");
                            });
                        }
                    });
                    
                    var bool_ismaploaded = false;
                    var maps_latlng, maps_map, maps_marker, maps_infowindow;
                    
                    var el_papermap1 = new_area_ctpaper.getElement('.papermap1');
                    el_papermap1.addEvent('click', function(){
                        if(el_googlemap_win.get('stsopen') == "0"){
                            el_googlemap_win.setStyle('display', "block");
                            
                            new Fx.Elements([el_googlemap_win, el_googlemap_close], {
                                duration:1000,
                                transition:"cubic:in:out",
                                onComplete:function(){
                                    el_googlemap_map.setStyle('visibility', "visible");
                                    
                                    if(!bool_ismaploaded){
                                        with(google.maps){
                                            maps_latlng = new LatLng(13.7019, 100.6177);
                                            maps_map = new Map(el_googlemap_map, {
                                                zoom:16,
                                                center:maps_latlng,
                                                mapTypeId:MapTypeId.ROADMAP,
                                                streetViewControl:false
                                            });
                                        
                                            maps_marker = new Marker({map:maps_map, position:maps_latlng});
                                            event.addListener(maps_marker, "click", function(){
                                                maps_infowindow = new InfoWindow({
                                                    content:'<div align="left" style="font-family:Tahoma; font-size:10pt; line-height:18px;">'+
                                                                '<div><b style="display:inline-block; width:60px;">Company</b> : บริษัท มิวอิม จำกัด (MUiME Co., Ltd.)</div>'+
                                                                '<div><b style="display:inline-block; width:60px;">Address</b> : 455 ซอย พึ่งมี 23 ถนน สุขุมวิท 93 บางจาก พระโขนง กรุงเทพฯ 10260</div>'+
                                                                '<div><b style="display:inline-block; width:60px;">Tel.</b> : 0-2311-0589 <span style="display:inline-block; width:60px;"></span> <b style="display:inline-block; width:60px;">Fax.</b> : 0-2311-0589 ต่อ 4</div>'+
                                                            '</div>',
                                                    position:maps_latlng
                                                });
                                                maps_infowindow.open(maps_map);
                                            });
                                            
                                            bool_ismaploaded = true;
                                        }
                                    }
                                    else{
                                        maps_map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                                    }
                                    
                                    el_googlemap_win.set('stsopen', "1");
                                }
                            }).start({
                                0: {
                                    'top':[el_googlemap_win.get('topstart').toInt(), el_googlemap_win.get('topfinish').toInt()],
                                    'left':[el_googlemap_win.get('leftstart').toInt(), el_googlemap_win.get('leftfinish').toInt()],
                                    'width':[0, el_googlemap_win.get('width').toInt()],
                                    'height':[0, el_googlemap_win.get('height').toInt()]
                                },
                                1: {
                                    'opacity':1
                                }
                            });
                            el_googlemap_win.setStyles({
                                '-moz-box-shadow':"0 0 24px #333",
                                '-webkit-box-shadow':"0 0 24px #333",
                                'box-shadow':"0 0 24px #333"
                            });
                        }
                        else{
                            maps_map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        }
                    });
                    
                    timeoutid = (function(){
                        var el_iphonemap = new_area_ctpaper.getElement('.iphonemap');
                        el_iphonemap.setStyles({'opacity':1, 'cursor':"pointer"});
                        el_iphonemap.addEvent('click', function(){
                            if(el_googlemap_win.get('stsopen') == "0"){
                                el_googlemap_win.setStyle('display', "block");
                                
                                new Fx.Elements([el_googlemap_win, el_googlemap_close], {
                                    duration:1000,
                                    transition:"cubic:in:out",
                                    onComplete:function(){
                                        el_googlemap_map.setStyle('visibility', "visible");
                                        
                                        if(!bool_ismaploaded){
                                            with(google.maps){
                                                maps_latlng = new LatLng(13.7019, 100.6177);
                                                maps_map = new Map(el_googlemap_map, {
                                                    zoom:16,
                                                    center:maps_latlng,
                                                    mapTypeId:MapTypeId.HYBRID,
                                                    streetViewControl:false
                                                });
                                            
                                                maps_marker = new Marker({map:maps_map, position:maps_latlng});
                                                event.addListener(maps_marker, "click", function(){
                                                    maps_infowindow = new InfoWindow({
                                                        content:'<div align="left" style="font-family:Tahoma; font-size:10pt; line-height:18px;">'+
                                                                    '<div><b style="display:inline-block; width:60px;">Company</b> : บริษัท มิวอิม จำกัด (MUiME Co., Ltd.)</div>'+
                                                                    '<div><b style="display:inline-block; width:60px;">Address</b> : 455 ซอย พึ่งมี 23 ถนน สุขุมวิท 93 บางจาก พระโขนง กรุงเทพฯ 10260</div>'+
                                                                    '<div><b style="display:inline-block; width:60px;">Tel.</b> : 0-2311-0589 <span style="display:inline-block; width:60px;"></span> <b style="display:inline-block; width:60px;">Fax.</b> : 0-2311-0589 ต่อ 4</div>'+
                                                                '</div>',
                                                        position:maps_latlng
                                                    });
                                                    maps_infowindow.open(maps_map);
                                                });
                                                
                                                bool_ismaploaded = true;
                                            }
                                        }
                                        else{
                                            maps_map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                                        }
                                        
                                        el_googlemap_win.set('stsopen', "1");
                                    }
                                }).start({
                                    0: {
                                        'top':[el_googlemap_win.get('topstart').toInt(), el_googlemap_win.get('topfinish').toInt()],
                                        'left':[el_googlemap_win.get('leftstart').toInt(), el_googlemap_win.get('leftfinish').toInt()],
                                        'width':[0, el_googlemap_win.get('width').toInt()],
                                        'height':[0, el_googlemap_win.get('height').toInt()]
                                    },
                                    1: {
                                        'opacity':1
                                    }
                                });
                                el_googlemap_win.setStyles({
                                    '-moz-box-shadow':"0 0 24px #333",
                                    '-webkit-box-shadow':"0 0 24px #333",
                                    'box-shadow':"0 0 24px #333"
                                });
                            }
                            else{
                                maps_map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                            }
                        });    
                    }).delay(2000);
                }
            }
        }
    }).start({
        0:{'height':new_contentprint.offsetHeight},
        1:{'height':new_contentprint.offsetHeight}
    });
    
    new Fx.Scroll($('area_containerprint'), {
        duration:2000
    }).toTop();
}