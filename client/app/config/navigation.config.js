(function() {
  'use strict';

  angular.module('app.config')
    .config(navigation)
    .run(init);

  /** @ngInject */
  function navigation(NavigationProvider) {
    NavigationProvider.configure({
      items: {
        dashboard: {
          title: N_('Dashboard'),
          state: 'dashboard',
          iconClass: 'fa fa-dashboard'
        },
        services: {
          title: N_('My Services'),
          state: 'services',
          iconClass: 'fa fa-file-o',
          badges: [
            {
              count: 287,
              tooltip: N_('The total number of services that you have ordered, both active and retired')
            }
          ]
        },
        requests: {
          title: N_('My Requests'),
          state: 'requests',
          iconClass: 'fa fa-file-text-o',
          badges: [
            {
              count: 0,
              tooltip: N_('The total number of requests that you have submitted')
            }
          ]
        },
        marketplace: {
          title: N_('Service Catalog'),
          state: 'marketplace',
          iconClass: 'fa fa-copy',
          badges: [
            {
              count: 0,
              tooltip: N_('The total number of available catalog items')
            }
          ]
        },
        designer: {
          title: N_('Designer'),
          state: 'designer',
          iconClass: 'pficon pficon-blueprint',
          secondary: {
            blueprints: {
              title: N_('Blueprints'),
              state: 'designer.blueprints',
              badges: [
                {
                  count: 0,
                  tooltip: N_('The total number of available blueprints')
                }
              ]
            },
            rules: {
              title: N_('Rules'),
              state: 'designer.rules',
              badges: [
                {
                  count: 0,
                  tooltip: N_('The total number of available arbitration rules')
                }
              ]
            }
          }
        }
      }
    });
  }

  /** @ngInject */
  function init(lodash, CollectionsApi, Navigation, NavCounts) {
    NavCounts.add('services', fetchServices, 60 * 1000);
    NavCounts.add('requests', fetchRequests, 60 * 1000);
    NavCounts.add('marketplace', fetchServiceTemplates, 60 * 1000);
    NavCounts.add('blueprints', fetchBlueprints, 60 * 1000);
    NavCounts.add('rules', fetchRules, 60 * 1000);

    function fetchRequests() {
      var filterValues = ['type=ServiceReconfigureRequest', 'or type=ServiceTemplateProvisionRequest'];
      var options = {
        auto_refresh: true,
        filter: filterValues
      };

      CollectionsApi.query('requests', options)
        .then(lodash.partial(updateCount, 'requests'));
    }

    function fetchServices() {
      var options = {
        expand: false,
        filter: ['service_id=nil'],
        auto_refresh: true,
      };

      CollectionsApi.query('services', options)
        .then(lodash.partial(updateServicesCount, 'services'));
    }

    function fetchServiceTemplates() {
      var options = {
        expand: false,
        filter: ['service_template_catalog_id>0', 'display=true'],
        auto_refresh: true,
      };

      CollectionsApi.query('service_templates', options)
        .then(lodash.partial(updateServiceTemplatesCount, 'marketplace'));
    }

    function fetchBlueprints() {
      var options = {
        expand: false,
        filter: ['id>0'],
        auto_refresh: true,
      };

      CollectionsApi.query('blueprints', options)
        .then(lodash.partial(updateBlueprintsCount, 'blueprints'));
    }

    function fetchRules() {
      var options = {
        expand: false,
        filter: ['id>0'],
        auto_refresh: true,
      };

      CollectionsApi.query('arbitration_rules', options)
          .then(lodash.partial(updateRulesCount, 'rules'));
    }

    function updateCount(item, data) {
      Navigation.items[item].badges[0].count = data.subcount;
    }

    function updateServicesCount(item, data) {
      Navigation.items[item].badges[0].count = data.subcount;
    }

    function updateServiceTemplatesCount(item, data) {
      Navigation.items[item].badges[0].count = data.subcount;
    }

    function updateBlueprintsCount(item, data) {
      Navigation.items.designer.secondary[item].count = data.subcount;
    }

    function updateRulesCount(item, data) {
      Navigation.items.designer.secondary[item].count = data.subcount;
    }
  }
})();
