module.exports = {
    databaseConnection: require('./connection'),
    AdminRepository: require('./repository/admin'),
    SellerRepository: require('./repository/seller'),
    BuyerRepository: require('./repository/buyer'),
    OtherRepository: require('./repository/other')
}