(function (a) {
    a.fn.zoomsaic = function (b) {
        if(b.height === undefined){b.height=0;}
        if(b.easepage === undefined){b.easepage='linear';}
        if(b.easein === undefined){b.easein='linear';}
        if(b.easout === undefined){b.easout='linear';}
        if(b.navigator === undefined){b.navigator=false;}
        if(b.pagination === undefined){b.pagination=false;}
        if(b.elements_per_page === undefined){b.elements_per_page=999999;}
        if(b.columns === undefined){b.columns = parseInt(parseInt(b.width)/parseInt(b.box_width));}
        if(b.box_width === undefined){b.box_width=parseInt(b.width/b.columns);}
        if(b.box_height === undefined){b.box_height=parseInt(b.width/b.columns);}
        if(b.max_box_width === undefined){b.max_box_width=parseInt(b.box_width+b.box_width*0.50);}
        if(b.max_box_height === undefined){b.max_box_height=parseInt(b.box_height+b.box_height*0.50);}
        
        this.each(function (j,k) {
            var counter = 0;
            var pages = 0;
            var buffer = new Array;
            var length = parseInt($(this).children('.zoomsaic-element').length);

            var elements = new Array;                
            $(this).children('.zoomsaic-element').each(function(i,e){               
                elements.push('<div class="zoomsaic-element" style="width:'+b.box_width+'px;height:'+b.box_height+'px">'+$(e).html()+'</div>');
            });                

            var c_width = parseInt(parseInt(b.width)*(length/parseInt(b.elements_per_page)+1));
            var c_height = parseInt(b.height);
            buffer.push('<div class="zoomsaic-container" style="display:none;width:'+c_width+'px;height:'+c_height+'px;">');

            $(elements).each(function(i,e){
                if(counter===0){
                    if(pages!==0){
                        buffer.push('<div class="zoomsaic-pager" data-page="'+pages+'" style="width:'+parseInt(b.width)+'px;height:'+c_height+'px;">');                            
                    }else{
                        buffer.push('<div class="zoomsaic-pager active" data-page="'+pages+'" style="width:'+parseInt(b.width)+'px;height:'+c_height+'px;">');                                 
                    }
                }
                buffer.push(e);
                counter++;
                if(counter===b.elements_per_page){
                    counter = 0;
                    pages++;
                    buffer.push('</div>');
                }
            });
            if(counter!==0){
                pages++;
                buffer.push('</div>');                    
            }
            buffer.push('</div>');
            if(b.navigator === true && pages > 1){
                buffer.push('<div class="zoomsaic-navigator">');
                for(var l=0;l<pages;l++){
                    if(l!==0){
                        buffer.push('<div class="zoomsaic-page" data-page='+l+'>'+l+'</div>');
                    }else{
                        buffer.push('<div class="zoomsaic-page active" data-page='+l+'>'+l+'</div>');                            
                    }
                }
                buffer.push('</div>');                    
            }
            $(k).html(buffer.join(""));
            if(b.navigator === true && pages > 1){
                $(k).find('.zoomsaic-page').click(function(o){
                    o.preventDefault();
                    var page_click = $(this);                        
                    $(k).find('.zoomsaic-after').hide();     
                    var page_number = parseInt($(page_click).attr('data-page'));

                    var left = page_number*parseInt(b.width);
                    if(b.direction === "left"){
                        left = -1*left;
                    }
                    $(k).find('.zoomsaic-page').removeClass('active');
                    $(k).find('.zoomsaic-page[data-page="'+page_number+'"]').addClass('active');
                    $(k).find('.zoomsaic-pager').each(function(l,g){
                        if(parseInt($(g).attr('data-page'))===page_number){
                            $(g).children('.zoomsaic-element').fadeIn('slow');
                            $(g).addClass('active');
                        }else{
                            $(g).children('.zoomsaic-element').fadeOut('slow');                                
                            $(g).removeClass('active');
                        }
                    });
                    $(page_click).parent().parent().find('.zoomsaic-container').animate({
                        left: left
                    },500,b.easepage,function(){

                    });
                });
            }
            
            var boxes = $(k).find('.zoomsaic-element');
            counter = 0;
            var row = 0;
            $(boxes).each(function(n,m) {
                var offset = parseInt($(m).parent().attr('data-page'))*parseInt(b.width);
                var left = offset + (n % parseInt(b.columns) * parseInt(b.box_width));
                var top = parseInt(b.box_height)*row;
                $(this).css("position", "absolute");
                $(this).css("left", left + "px");
                $(this).css("top", top + "px");
                
                $(this).attr('data-aleft',left-(b.max_box_width-b.box_width)/2);
                $(this).attr('data-atop',top-(b.max_box_height-b.box_height)/2);
                $(this).attr('data-bleft',left);
                $(this).attr('data-btop',top);
                
                $(this).attr('data-counter',counter);
                $(this).attr('data-row',row);
                $(this).hover(function() {
                    $(this).addClass('active');
                    $(this).css("z-index", 1); 
                    $(this).stop().animate({
                        height: b.max_box_height, 
                        width: b.max_box_width, 
                        left: $(this).attr('data-aleft'), 
                        top: $(this).attr('data-atop')
                        }, "fast", b.easein, function(){                     
                            $(this).children('.zoomsaic-after').fadeIn();                              
                    });
                }, function() {                                
                    $(this).parent().find('.zoomsaic-after').fadeOut();      
                    $(this).css("z-index", 0);
                    $(this).removeClass('active');
                    $(this).stop().animate({ 
                        height: b.box_height, 
                        width: b.box_width, 
                        left: $(this).attr('data-bleft'), 
                        top: $(this).attr('data-btop')
                        }, "fast", b.easeout, function(){        
                    });                       
                });
                
                counter++;
                if(counter>b.columns-1){
                    row++;
                    counter=0;
                }
                if(b.navigator === true && row>parseInt(b.elements_per_page)/parseInt(b.columns)-1){
                    row = 0;
                }
            });
             
            $(k).css('height',b.height);
            if(b.navigator === false && $(k).height() === 0){
                if(counter!==0){
                    row++;
                } 
                $(k).height(row*b.box_height);
                $(k).find('.zoomsaic-container').height(row*b.box_height);
                $(k).find('.zoomsaic-pager').height(row*b.box_height);
            }
            $(k).css('width',b.width);
            $(k).find('.zoomsaic-container').show();    
            $(k).find('.zoomsaic-pager').each(function(l,g){
                if(parseInt($(g).attr('data-page'))===0){
                    $(g).children('.zoomsaic-element').show();
                }else{
                    $(g).children('.zoomsaic-element').hide();                                
                }
            });
        });
    };
})(jQuery);