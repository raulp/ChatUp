var _ = require('lodash');
var redis = require('redis');
var WorkersManager = (function () {
    function WorkersManager(parent) {
        var _this = this;
        this._workerRefresh = function () {
            _this._redisConnection.keys('chatUp:chatServer:*', function (err, workersName) {
                if (err) {
                    setTimeout(_this._workerRefresh, _this._parent._conf.workerRefreshInterval).unref();
                    return console.error('Error on redis command:', err);
                }
                var multi = _this._redisConnection.multi();
                _.each(workersName, function (name) { multi.hgetall(name); });
                multi.exec(function (err, workersInfo) {
                    if (err) {
                        console.error('Error on redis command:', err);
                    }
                    else {
                        _this._workers = {};
                        _.each(workersName, function (name, i) {
                            _this._workers[name] = workersInfo[i];
                            _this._workers[name].port = Number(workersInfo[i].port);
                        });
                        console.log(_this._workers);
                    }
                    setTimeout(_this._workerRefresh, _this._parent._conf.workerRefreshInterval).unref();
                });
            });
        };
        this._parent = parent;
        this._redisConnection = redis.createClient(this._parent._conf.redis.port, this._parent._conf.redis.host);
        this._workerRefresh();
    }
    WorkersManager.prototype.getAvailable = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var worker = _.sample(_this._workers);
            if (worker) {
                resolve(worker);
            }
            else {
                reject(new Error('No worker available'));
            }
        });
    };
    return WorkersManager;
})();
;
module.exports = WorkersManager;
