// must restart server whenever you make changes in next.config
module.exports = {
  env: {
    MONGO_SRV:
      "mongodb+srv://ChrisChartrand:snz7OnmBPZIrYiFq@damagedrecords-l0d3c.mongodb.net/test?retryWrites=true&w=majority",
    JWT_SECRET: "ldfjs534hlhgdfkdjshfj$%#j",
    CLOUDINARY_URL:
      "https://api.cloudinary.com/v1_1/chrischartranddevelopment/image/upload",
    STRIPE_SECRET_KEY: "<insert-stripe-secret-key>"
  }
};
