

import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const bucketName = process.env.AWS_S3_BUCKET_NAME!;
const accessKeyId = process.env.AWS_ACCESS_KEY!;
const secretAccessKey = process.env.AWS_SECRET_KEY!;
const region = process.env.AWS_REGION!;

const s3 = new S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

export const uploadImages = async (image: string, folder: string, ext: string) => {
  try {
    const buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const uploadData = {
      Bucket: bucketName,
      Body: buf,
      ACL: 'public-read',
      Key: `${folder}/${uuidv4()}.${ext}`
    };
    const data = await s3.upload(uploadData).promise();
    return {
      img_url: data.Location,
      img_key: data.Key
    };
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error to handle it in the caller
  }
};

export const deleteImages = async (key: string) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  try {
    const data = await s3.deleteObject(params).promise();
    return data;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error to handle it in the caller
  }
};
