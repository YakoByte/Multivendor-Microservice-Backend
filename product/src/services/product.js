const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(userInputs) {
    const { name, description, Specification, price, sellerDiscount, adminDiscount, stock, categoryId, subCategoryId, configurationId, badgeId, sellerId, manufacturerId, offerId, Images } = userInputs;
    try {
      const Product = await this.repository.CreateProduct({ name, description, Specification, price, sellerDiscount, adminDiscount, stock, categoryId, subCategoryId, configurationId, badgeId, sellerId, manufacturerId, offerId });
      const Image = await this.repository.CreateImage({productId: Product._id, Images})
      return FormateData({ Product, Image });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async updateProduct(userInputs) {
    const { sellerId, productId, data, Images } = userInputs;
    try {
        const Product = await this.repository.updateProduct({ sellerId, productId, data, Images });
        if(!Product) {
            return FormateData({ message: 'No such product exists' });
        }
        const ProductImages = []
        if(Images){
          ProductImages = await this.repository.CreateImage({productId, Images});
        }
        return FormateData({ Product, ProductImages });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }

  async FindProduct(userInputs) {
    const { productId } = userInputs;
    try {
        const Product = await this.repository.FindProduct({ productId });
        if(!Product) {
            return FormateData({ message: 'No such product exists' });
        }
        return FormateData({ Product });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }

  async FindAllProduct() {
    try {
        const Product = await this.repository.FindAllProduct();
        if(!Product) {
            return FormateData({ message: 'No product exists' });
        }
        return FormateData({ Product });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }

  async FindKeyProduct(userInputs) {
    const { data } = userInputs;
    try {
        const query = {};

    if (data.Specification) {
        query.subCategoryId = { $in: data.subCategoryId };
    }

    if (data.categoryId) {
      query.categoryId = data.categoryId;
    }

    if (data.subCategoryId) {
        query.subCategoryId = data.subCategoryId;
      }

    if (data.subCategoryId) {
        query.subCategoryId = { $in: data.subCategoryId };
    }

    if(data.configurationId) {
      query.configurationId = configurationId;
    }

    if(data.UpperPrice){
        query.price = { $lt: data.UpperPrice };
    }

    if (data.LowerPrice) {
        query.price = { $gt: data.LowerPrice };
    }

    if(data.badgeId) {
        query.badges = data.badgeId;
    }

    const Product = await this.repository.FindKeyProduct({ query });
    if(!Product) {
        return FormateData({ message: 'No such product exists' });
    }
    return FormateData({ Product });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }

  async DeleteProduct(userInputs) {
    const { sellerId, productId } = userInputs;
    try {
        const Product = await this.repository.DeleteProduct({ sellerId, productId });
        if(!Product) {
            return FormateData({ message: 'No such product exists' });
        }
        const Image = await this.repository.deleteImages({ productId: Product._id })
        return FormateData({ Product, Image });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }

  async DeleteOneImage(userInputs) {
    const { ImageId } = userInputs;
    try {
        const Image = await this.repository.DeleteOneImage({ ImageId });
        if(!Image) {
            return FormateData({ message: 'No such Images exists' });
        }
        return FormateData({ Image });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }
}

module.exports = ProductService;