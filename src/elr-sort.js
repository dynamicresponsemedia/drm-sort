(function($) {
    window.elrSort = function(params) {
        var self = {},
            spec = params || {};

        spec.listsClass = 'elr-sortable';
        spec.autoSort = true;
        spec.buttonClass = 'elr-sort-list';
        spec.activeClass = 'active';
        spec.ignoreWords = ['a', 'the'];

        var buttonClass = '.' + spec.buttonClass;

        var toggleActiveClass = function(className, parent) {
            $(this).closest(parent).find('.' + className).removeClass(className).end().end().addClass(className);
        };

        var sortList = function(direction, $listItems) {
            var type = $listItems.parent().data('type');
            var types = [];
            // var values = elr.toArray($listItems);
            // var types = elr.getDataTypes(values, type);

            if ( type ) {
                types.push(type);
            } else { 
                types = ['date', 'time', 'number', 'alpha'];
            }

            return elr.sortComplexList(types, $listItems, direction);
        };

        var renderSort = function(sortedList, $list) {
            $list.empty();
            
            $.each(sortedList, function() {
                var value = $.trim($(this).text());
                var $listItem = $('<li>', {
                    text: value
                });
                $list.append($listItem);
            });
        };

        var $lists = $('.' + spec.listsClass);

        if ( spec.autoSort ) {
            $.each($lists, function() {
                var $list = $(this);
                var $listItems = $list.find('li');
                var $sortedList = sortList('ascending', $listItems);

                renderSort($sortedList, $list);
                $("button." + spec.buttonClass + "[data-sort='ascending']").addClass(spec.activeClass);
            });
        }

        $('body').on('click', buttonClass, function() {
            var $that = $(this);
            var listId = $that.data('list');
            var $list = $('ul#' + listId);
            var direction = $that.data('sort');
            var $listItems = $list.find('li');
            var $sortedList = sortList(direction, $listItems);

            renderSort($sortedList, $list);
            toggleActiveClass.call(this, 'active', '.button-group');
        });

        return self;
    };
})(jQuery);