import { db } from '@/db';
import { notFound } from 'next/navigation';

import DesingConfigurator from './DesingConfigurator';

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const DesignPage = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  // make db call

  // if there is not id or id not string
  if (!id || typeof id !== 'string') {
    return notFound();
  }
  const configuration = await db.configuration.findUnique({
    where: { id },
  });
  // if id not found on db
  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;

  return (
    <DesingConfigurator
      configId={id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  );
};
export default DesignPage;
