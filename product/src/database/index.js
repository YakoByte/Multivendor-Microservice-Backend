module.exports = {
    databaseConnection: require('./connection'),
    BadgeRepository: require('./repository/badge'),
    CartRepository: require('./repository/cart'),
    CategoryRepository: require('./repository/category'),
    ConfigurationRepository: require('./repository/configuration'),
    FeedbackRepository: require('./repository/feedback'),
    ManufacturerRepository: require('./repository/manufacturer'),
    OfferRepository: require('./repository/offer'),
    ProductRepository: require('./repository/product'),
    RatingRepository: require('./repository/rating'),
    ReviewRepository: require('./repository/review'),
    SubCategoryRepository: require('./repository/subCategory'),
    WishlistRepository: require('./repository/wishlist'),
}