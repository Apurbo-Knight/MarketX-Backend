const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dogldxv8g', 
    api_key: '788237367479459', 
    api_secret: 'n3QqtxP3xiZuB8qjLYuTQGDsFuQ'
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

module.exports = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if(result && result.secure_url) {
                return resolve(result.secure_url)
            }
            console.log(error.message)
            return reject({message: error.message})
        })
    })
}