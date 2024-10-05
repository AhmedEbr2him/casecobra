import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { z } from 'zod'; // Z -> is a scheme validation library with static type interfce
import sharp from 'sharp';
import { db } from '@/db';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '16MB' } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const res = await fetch(file.url); // fetch image
      const buffer = await res.arrayBuffer(); // convert image to buffer
      const imageMetadata = await sharp(buffer).metadata(); //grab image metadata
      const { width, height } = imageMetadata; // get aspect ratio for our image

      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          },
        });

        return { configId: configuration.id };
      } else {
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });
        return { configId: updatedConfiguration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
