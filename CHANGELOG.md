# Changelog

## [1.1.0](https://github.com/WMS-Corporation/wms-orderControl-service/compare/v1.0.1...v1.1.0) (2024-06-30)


### Features

* Validate product existence when creating and modifying orders ([f8bd396](https://github.com/WMS-Corporation/wms-orderControl-service/commit/f8bd39659437c64d9bd51f49459ff8dc4f76e2bb))


### Bug Fixes

* Updated method that modified an order data ([0d6942a](https://github.com/WMS-Corporation/wms-orderControl-service/commit/0d6942aaa47118e0f4f74b15fdf59630c1865e43))

## [1.0.1](https://github.com/WMS-Corporation/wms-orderControl-service/compare/v1.0.0...v1.0.1) (2024-05-03)


### Bug Fixes

* Modified method that generated a unique order code ([bd6bced](https://github.com/WMS-Corporation/wms-orderControl-service/commit/bd6bcede0957f0c905aa964620242c62081a0a12))
* Modified method that update order data ([6109dc4](https://github.com/WMS-Corporation/wms-orderControl-service/commit/6109dc4222f4c76425f8a240cbd99cb300a63570))
* Refactored product structure within Order and added validation for product list updates ([6aa34ac](https://github.com/WMS-Corporation/wms-orderControl-service/commit/6aa34ac8a3554dbb613363dc18416a22341f4418))
* Updated config file ([9e76958](https://github.com/WMS-Corporation/wms-orderControl-service/commit/9e769585e06f60a1d96c5fefd518744d02789909))

## 1.0.0 (2024-03-18)


### Features

* add automatic test, sonarcloud analisys, husky hook and release-please ([e624017](https://github.com/WMS-Corporation/wms-orderControl-service/commit/e624017bfb8b2c1ef829be1c4c92e17b63d1feab))
* Implemented middleware to protect the routes ([7c04b12](https://github.com/WMS-Corporation/wms-orderControl-service/commit/7c04b12b209e4543c3b873cfa3ce5abfb839e225))
* Implemented order entity ([6b5f035](https://github.com/WMS-Corporation/wms-orderControl-service/commit/6b5f0355261bdf1b205818c6c941a2fa1de154c4))
* Implemented route to create a new order ([f953118](https://github.com/WMS-Corporation/wms-orderControl-service/commit/f953118b8b107f39e30a4f3225c6e230cebf4bd0))
* Implemented route to return all orders that are stored ([9d01a48](https://github.com/WMS-Corporation/wms-orderControl-service/commit/9d01a48f05a39ddbb16ea87cbc47c95c1fef3a16))
* Implemented route to return an order based on its code ([cb4213b](https://github.com/WMS-Corporation/wms-orderControl-service/commit/cb4213b3fd707caf84dc7a14e0e17c891e1e5ffe))
* Implemented the connection to db ([0de3bf8](https://github.com/WMS-Corporation/wms-orderControl-service/commit/0de3bf8aa1cf41af0bd169b903bccca0086e519f))
* Implemeted route to update an order data ([8778727](https://github.com/WMS-Corporation/wms-orderControl-service/commit/87787273ad9c8f973a5f271e599f4c4c89046489))


### Bug Fixes

* fix coverage test setup ([dd87d66](https://github.com/WMS-Corporation/wms-orderControl-service/commit/dd87d66ea495395f554d193fedb8fd357cfaed7f))
* Modified management of the list of products in the order ([6522f07](https://github.com/WMS-Corporation/wms-orderControl-service/commit/6522f0791524cfefe4b3e0f5ff3118eec3be1436))
