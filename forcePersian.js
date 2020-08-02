(function($){
    $.forcePersian = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data('forcePersian', base);

        base.getSelectedText = function(el) {
            var start = el.selectionStart;
            var finish = el.selectionEnd;
            return el.value.toString().substring(start, finish);
        };

        base.selectRange = function(el, start, end) {
            if (end === undefined) {
                end = start;
            }
            if ('selectionStart' in el) {
                el.selectionStart = start;
                el.selectionEnd = end;
            } else if (el.setSelectionRange) {
                el.setSelectionRange(start, end);
            } else if (el.createTextRange) {
                var range = el.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        };
        
        base.init = function(){
            base.options = $.extend({},$.forcePersian.defaultOptions, options);
            base.$el.off('keydown').on('keydown', function(e){
                var persianChar = [ "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و","؟","ئ" ],
                    englishChar = [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",","?","m" ];

                var cursor_pos = base.$el.prop('selectionStart');
                var selected_text = base.getSelectedText(base.el);
                if (e.key.length == 1 && !e.ctrlKey) {
                    var value = base.$el.val();
                    if (selected_text.length === 0) {
                        var text_before = value.substring(0,  cursor_pos);
                        var text_after  = value.substring(cursor_pos, value.length);
                        value = text_before + e.key.toLowerCase() + text_after;
                    } else {
                        value = value.replace(selected_text, e.key.toLowerCase());
                    }

                    for (var i = 0; i < englishChar.length; i++) {
                        var c = persianChar[i];
                        if (i === 17 && e.shiftKey) {
                            c = 'آ';
                        }
                        value = value.replace(new RegExp('[' + englishChar[i] + ']', 'g'), c);
                    }
                    value = value.replace(/[a-zA-Z]+/g, '');
                    e.preventDefault();
                    base.$el.val(value).focus();
                    base.selectRange(base.el, cursor_pos + 1);
                }
            });
            base.$el.off('change').on('change', function(e){
                var val = base.$el.val().toString();
                val = val.replace(/[a-zA-Z]+/g, '');
                base.$el.val(val);
            });
        };
        
        base.init();
    };
    
    $.forcePersian.defaultOptions = {};
    
    $.fn.forcePersian = function(options){
        return this.each(function(){
            (new $.forcePersian(this, options));
        });
    };
})(jQuery);