const { productModel, imageModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ProductRepository {
  async calculateFinalPrice(price, sellerDiscount, adminDiscount) {
    try {
      if (product.length === 0) {
        return 0;
      }

      let totalPrice = price - sellerDiscount - adminDiscount;

      return totalPrice;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createProduct({ name, description, Specification, price, sellerDiscount, adminDiscount, stock, categoryId, subCategoryId, configurationId, badgeId, sellerId, manufacturerId, offerId }) {
    try {
      const customId = `${sellerId}-${name}`;

      const existingProduct = await productModel.findOne({ customId: customId });
      
      if (existingProduct) {
        return null;
      }

      const totalPrice = await this.calculateFinalPrice(price, sellerDiscount, adminDiscount);

      const product = new productModel({
        customId: customId,
        name: name,
        description: description,
        Specification: [Specification],
        price: price,
        sellerDiscount: sellerDiscount,
        adminDiscount: adminDiscount,
        totalPrice: totalPrice,
        stock: stock,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        configurationId: [configurationId],
        badgeId: badgeId,
        sellerId: sellerId,
        manufacturerId: manufacturerId,
        offerId: offerId,
      });

      const productResult = await product.save();
      return productResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async CreateImage({ productId, Images }) {
    try {
      for (let i = 0; i < Images.length; i++) {
        const { imagePath, mimeType, imageSize } = Images[i];
  
        const imageData = new imageModel({
          productId: productId,
          imagePath: imagePath,
          mimeType: mimeType,
          imageSize: imageSize,
        });
  
        await imageData.save();
      }
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }
  
  async FindProduct({ productId }) {
    try {
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        return null; 
      }
  
      const ImageData = await imageModel.find({ productId: product._id });
  
      return {
        product,
        ImageData,
      };
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async FindKeyProduct({ query }) {
    try {
      const products = await productModel.find(query);
      const productData = [];
  
      if (products.length > 0) {
        const productPromises = products.map(async (product) => {
          const imageData = await imageModel.find({ productId: product._id });
          productData.push({
            customId: product.customId,
            name: product.name,
            description: product.description,
            Specification: product.Specification,
            price: product.price,
            sellerDiscount: product.sellerDiscount,
            adminDiscount: product.adminDiscount,
            finalPrice: product.finalPrice,
            stock: product.stock,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
            configurationId: product.configurationId,
            badgeId: product.badgeId,
            sellerId: product.sellerId,
            manufacturerId: product.manufacturerId,
            offerId: product.offerId,
            ImageData: imageData,
          });
        });
  
        await Promise.all(productPromises);
      }
  
      return productData;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }
  
  async FindAllProduct() {
    try {
      const products = await productModel.find();
      const productResult = [];
  
      for (const product of products) {
        const imageData = await imageModel.find({ productId: product._id });
        productResult.push({ product, imageData });
      }
  
      return productResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }  

  async updateProduct({ sellerId, productId, data }) {
    try {
      const updatedData = { ...data };

      if (updatedData.customId || updatedData.name) {
        delete updatedData.customId;
        delete updatedData.name;
      }

      const product = await productModel.findOneAndUpdate(
        { _id: productId, sellerId: sellerId },
        updatedData,
        { new: true }
      );

      if (!product) {
        return null;
      }

      return product;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        error.message
      );
    }
  }

  async DeleteProduct({ sellerId, productId }) {
    try {
      const ProductResult = await productModel.findOneAndDelete({
        _id: productId,
        sellerId: sellerId,
      });
      if (ProductResult) {
        return ProductResult;
      }
      return null;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteOneImage({ ImageId }) {
    try {
      const imageData = await imageModel.findOneAndDelete({ _id: ImageId });
  
      if (imageData.deletedCount === 0) {
        return null;
      }
  
      return imageData;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async deleteImages({ productId }) {
    try {
      const imageData = await imageModel.deleteMany({ productId: productId });
  
      if (imageData.deletedCount === 0) {
        return null;
      }
  
      return imageData;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }
}

module.exports = ProductRepository;
