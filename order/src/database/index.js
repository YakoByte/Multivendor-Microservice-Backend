module.exports = {
    databaseConnection: require('./connection'),
    OrderRepository: require('./repository/order'),
    ShipmentRepository: require('./repository/shipment'),
    ReturnRepository: require('./repository/return')
}