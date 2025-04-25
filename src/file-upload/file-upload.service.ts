import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class FileUploadService {
  public async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result= await new Promise<UploadApiResponse>(
        (resolve, rejects) => {
          cloudinary.uploader
            .upload_stream({ folder: 'images' }, (error, uploadResult) => {
              if (error) return rejects(error);
              if (uploadResult) resolve(uploadResult);
            })
            .end(file.buffer);
        },
      );
      console.log(`Uploaded file: ${file.originalname} (${file.size} bytes)`);
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
  public async uploadMultiImages(files:Express.Multer.File[]):Promise<string[]>{
    try{
        const uploadPromises =  files.map((file)=> this.uploadImage(file))
        const result = await Promise.all(uploadPromises)
        return result;
    }catch(error){
        throw new BadRequestException(error)
    }
  }

}
