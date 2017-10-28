import elrUtilities from 'elr-utility-lib';
import elrUI from 'elr-ui';
import $ from 'jquery';

export default function({
    listsClass = 'elr-sortable',
    autoSort = true,
    buttonClass = 'elr-sort-button',
    activeClass = 'active',
    ignoreWords = ['a', 'the']
} = {}) {
    const sortButton = `.${buttonClass}`;
    const elr = elrUtilities()
    const ui = elrUI()

    const self = {
        sortTime($items, dir) {
            const sort = (a, b) => {
                const time1 = elr.patterns.sortTime.exec(elr.trim($(a).text()))[0];
                const time2 = elr.patterns.sortTime.exec(elr.trim($(b).text()))[0];

                if (elr.isTime(elr.trim($(a).text())) && elr.isTime(elr.trim($(b).text()))) {
                    a = new Date(`04-22-2014 ${elr.parseTime(time1)}`);
                    b = new Date(`04-22-2014 ${elr.parseTime(time2)}`);
                }

                return elr.sortValues(a, b, dir);
            };

            return $items.sort(sort);
        },
        sortDate($items, dir) {
            const sort = (a, b) => {
                if (elr.isDate(elr.trim($(a).text())) && elr.isDate(elr.trim($(b).text()))) {
                    a = new Date(elr.patterns.sortMonthDayYear.exec(elr.trim($(a).text())));
                    b = new Date(elr.patterns.sortMonthDayYear.exec(elr.trim($(b).text())));
                }

                return elr.sortValues(a, b, dir);
            };

            return $items.sort(sort);
        },
        sortAlpha($items, dir) {
            const sort = (a, b) => {
                a = elr.cleanAlpha(elr.trim($(a).text()), ['the', 'a']).toLowerCase();
                b = elr.cleanAlpha(elr.trim($(b).text()), ['the', 'a']).toLowerCase();

                return elr.sortValues(a, b, dir);
            };

            return $items.sort(sort);
        },
        sortNumber($items, dir) {
            const sort = (a, b) => {
                a = parseFloat(elr.trim($(a).text()));
                b = parseFloat(elr.trim($(b).text()));

                return elr.sortValues(a, b, dir);
            };

            return $items.sort(sort);
        },
        sortComplexList(types, listItems, dir = 'ascending') {
            // create sortList arrays
            const sortLists = elr.createArrays(types);

            // add list items to sortLists arrays

            $.each(types, function() {
                const type = this;

                $.each(listItems, function() {
                    const $listItem = $(this);
                    const val = elr.trim($listItem.text());

                    if (elr[`is${elr.capitalize(type)}`](val)) {
                        sortLists[type].push($listItem);
                    } else {
                        return;
                    }
                });

                $.each(sortLists[type], function() {
                    const val = ($(this).text());

                    $(listItems).each(function(k) {
                        const listVal = $(this).text();

                        if (listVal === val) {
                            listItems.splice(k, 1);
                        }
                    });
                });
            });

            // sort sortLists arrays
            $.each(sortLists, (key) => {
                this[`sort${elr.capitalize(key)}`](sortLists[key], dir);
            });

            return elr.concatArrays(sortLists);
        },
        sortList(direction, $listItems) {
            const type = $listItems.parent().data('type');
            let types;

            if (type) {
                types = [type];
            } else {
                types = ['date', 'time', 'number', 'alpha'];
            }

            return this.sortComplexList(types, $listItems, direction);
        },
        renderSort(sortedList, $list) {
            $list.empty();

            $.each(sortedList, function() {
                const value = elr.trim($(this).text());
                const $listItem = ui.createElement('li', {
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
}
