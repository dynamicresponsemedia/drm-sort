import elrUtlities from 'elr-utilities';
const $ = require('jquery');

let elr = elrUtlities();

const elrSort = function({
    listsClass = 'elr-sortable',
    autoSort = true,
    buttonClass = 'elr-sort-button',
    activeClass = 'active',
    ignoreWords = ['a', 'the']
} = {}) {
    const sortButton = `.${buttonClass}`;
    const self = {
        sortList(direction, $listItems) {
            const type = $listItems.parent().data('type');
            let types;

            if (type) {
                types = [type];
            } else {
                types = ['date', 'time', 'number', 'alpha'];
            }

            return elr.sortComplexList(types, $listItems, direction);
        },
        renderSort(sortedList, $list) {
            $list.empty();

            $.each(sortedList, function() {
                const value = elr.trim($(this).text());
                const $listItem = elr.createElement('li', {
                    text: value
                });

                $list.append($listItem);
            });
        }
    };

    const toggleActiveClass = function(className, parent) {
        $(this).closest(parent).find(`.${className}`).removeClass(className).end().end().addClass(className);
    };

    const $lists = $(`.${listsClass}`);

    if (autoSort) {
        $.each($lists, function() {
            const $list = $(this);
            const $listItems = $list.find('li');
            const $sortedList = self.sortList('ascending', $listItems);

            self.renderSort($sortedList, $list);
            $(`button.${buttonClass}[data-sort='ascending']`).addClass(activeClass);
        });
    }

    $('body').on('click', sortButton, function() {
        const $that = $(this);
        const listId = $that.data('list');
        const $list = $(`ul#${listId}`);
        const direction = $that.data('sort');
        const $listItems = $list.find('li');
        const $sortedList = self.sortList(direction, $listItems);

        self.renderSort($sortedList, $list);
        toggleActiveClass.call(this, 'active', '.button-group');
    });

    return self;
};

export default elrSort;