(function() {
  'use strict';

  angular.module('blocks.pub-sub')
    .factory('PubSub', PubSubFactory);

  /** @ngInject */
  function PubSubFactory(logger) {
    var service = {
      events: events
    };

    return service;

    function events() {
      return new PubSub();
    }

    function PubSub() {
      var vm = this;

      var events = {};

      vm.on = onEvent;
      vm.trigger = triggerEvent;

      function onEvent(keys, handler) {
        if (!angular.isFunction(handler)) {
          logger.error('Handler for `' + keys + '` is not a function. `' + typeof handler + '`');

          return;
        }
        keys.split(' ').forEach(function(key) {
          if (!events[key]) {
            events[key] = [];
          }
          events[key].push(handler);
        });

        return vm;
      }

      function triggerEvent(key, args) {
        var handlers = events[key] || [];

        handlers.every(handle);

        return vm;

        function handle(handler) {
          var result = handler(args);

          return angular.isUndefined(result) ? true : result;
        }
      }
    }
  }
})();
