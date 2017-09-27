var ProviderRequest = require('../../models/providerRequest');
var CustomerRequest = require('../../models/customerRequest');
var User = require('../../models/user');
var util = require('../../utils/util');
var async = require('async');


exports.dashboard = function(req, res) {
  async.parallel({
      latestProviderRequests: function(callback) {
        ProviderRequest.latestProviderRequests(20, function(err, result) {
          if (err) {
            return callback(err)
          } else {
            return callback(null, result);
          }
        });
      },
      recentCustomers: function(callback) {
        User.recentCustomers(20, function(err, result) {
          if (err) {
            return callback(err)
          } else {
            return callback(null, result);
          }
        });
      },
      carsAttended: function(callback) {
        return callback(null, 35);
      },
      moneyGenerated: function(callback) {
        return callback(null, 1542);
      },
      latestCustomerRequests: function(callback) {
        var ob1 = {
          address: 'Los Florines',
          status: 'pending',
          provider: {
            profile: {
              name: 'Juan Torres'
            }
          }
        };
        var ob2 = {
          address: 'Calle Comarca',
          status: 'finish',
          provider: {
            profile: {
              name: 'Carlos Guillen'
            }
          }
        };
        var ob3 = {
          address: 'Calle Leopoldo',
          status: 'in_progress',
          provider: {
            profile: {
              name: 'Andres Alvarez'
            }
          }
        };
        var ob4 = {
          address: "Nueva O'Higgins",
          status: 'canceled',
          provider: {
            profile: {
              name: 'Jose Ospina'
            }
          }
        };

        return callback(null, [ob1, ob2, ob3, ob4])
      }
    },
    function(err, results) {
      if (err) {
        return util.errorResponse(res, 'INTERNAL_ERROR', err);
      } else if (results) {
        return util.okResponse(res, 200, {
          latest_provider_requests: results.latestProviderRequests,
          recent_customers: results.recentCustomers,
          cars_attended: results.carsAttended,
          money_generated: results.moneyGenerated,
          latest_customer_requests: results.latestCustomerRequests
        });
      } else {
        return util.errorResponse(res, 'INTERNAL_ERROR');
      }
    });
}


exports.reports = function(req, res) {
  async.parallel({
      users: function(callback) {
        User.distribution(function(err, result) {
          if (err) {
            return callback(err)
          } else {
            return callback(null, result);
          }
        });
      },
      carsByProviders: function(callback) {
        return callback(null, []);
      },
      moneyByProviders: function(callback) {
        return callback(null, []);
      }
    },
    function(err, results) {
      if (err) {
        return util.errorResponse(res, 'INTERNAL_ERROR', err);
      } else if (results) {
        return util.okResponse(res, 200, {
          users_distribution: results.users,
          cars_by_providers: results.carsByProviders,
          money_by_providers: results.moneyByProviders
        });
      } else {
        return util.errorResponse(res, 'INTERNAL_ERROR');
      }
    });
}