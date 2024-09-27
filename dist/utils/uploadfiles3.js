"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.uploadImages = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;
const s3 = new aws_sdk_1.S3({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});
const uploadImages = async (image, folder, ext) => {
    try {
        const buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const uploadData = {
            Bucket: bucketName,
            Body: buf,
            ACL: 'public-read',
            Key: `${folder}/${(0, uuid_1.v4)()}.${ext}`
        };
        const data = await s3.upload(uploadData).promise();
        return {
            img_url: data.Location,
            img_key: data.Key
        };
    }
    catch (err) {
        console.error(err);
        throw err; // Re-throw the error to handle it in the caller
    }
};
exports.uploadImages = uploadImages;
const deleteImages = async (key) => {
    const params = {
        Bucket: bucketName,
        Key: key
    };
    try {
        const data = await s3.deleteObject(params).promise();
        return data;
    }
    catch (err) {
        console.error(err);
        throw err; // Re-throw the error to handle it in the caller
    }
};
exports.deleteImages = deleteImages;
