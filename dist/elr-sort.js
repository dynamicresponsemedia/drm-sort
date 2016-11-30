'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _elrUtilities = require('elr-utilities');

var _elrUtilities2 = _interopRequireDefault(_elrUtilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require('jquery');

var elr = (0, _elrUtilities2.default)();

var elrSort = function elrSort() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$listsClass = _ref.listsClass,
        listsClass = _ref$listsClass === undefined ? 'elr-sortable' : _ref$listsClass,
        _ref$autoSort = _ref.autoSort,
        autoSort = _ref$autoSort === undefined ? true : _ref$autoSort,
        _ref$buttonClass = _ref.buttonClass,
        buttonClass = _ref$buttonClass === undefined ? 'elr-sort-button' : _ref$buttonClass,
        _ref$activeClass = _ref.activeClass,
        activeClass = _ref$activeClass === undefined ? 'active' : _ref$activeClass,
        _ref$ignoreWords = _ref.ignoreWords,
        ignoreWords = _ref$ignoreWords === undefined ? ['a', 'the'] : _ref$ignoreWords;

    var sortButton = '.' + buttonClass;
    var self = {
        sortList: function sortList(direction, $listItems) {
            var type = $listItems.parent().data('type');
            var types = void 0;

            if (type) {
                types = [type];
            } else {
                types = ['date', 'time', 'number', 'alpha'];
            }

            return elr.sortComplexList(types, $listItems, direction);
        },
        renderSort: function renderSort(sortedList, $list) {
            $list.empty();

            $.each(sortedList, function () {
                var value = elr.trim($(this).text());
                var $listItem = elr.createElement('li', {
                    text: value
                });

                $list.append($listItem);
            });
        }
    };

    var toggleActiveClass = function toggleActiveClass(className, parent) {
        $(this).closest(parent).find('.' + className).removeClass(className).end().end().addClass(className);
    };

    var $lists = $('.' + listsClass);

    if (autoSort) {
        $.each($lists, function () {
            var $list = $(this);
            var $listItems = $list.find('li');
            var $sortedList = self.sortList('ascending', $listItems);

            self.renderSort($sortedList, $list);
            $('button.' + buttonClass + '[data-sort=\'ascending\']').addClass(activeClass);
        });
    }

    $('body').on('click', sortButton, function () {
        var $that = $(this);
        var listId = $that.data('list');
        var $list = $('ul#' + listId);
        var direction = $that.data('sort');
        var $listItems = $list.find('li');
        var $sortedList = self.sortList(direction, $listItems);

        self.renderSort($sortedList, $list);
        toggleActiveClass.call(this, 'active', '.button-group');
    });

    return self;
};

exports.default = elrSort;