module.exports = {
    databaseConnection: require('./connection'),
    UserRepository: require('./repository/user'),
    AdminRepository: require('./repository/admin'),
    SellerRepository: require('./repository/seller'),
    BuyerRepository: require('./repository/buyer'),
    OtherRepository: require('./repository/other')
}