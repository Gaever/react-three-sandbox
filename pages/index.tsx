import React from 'react';
import dynamic from 'next/dynamic'
import { wrapPage } from '../imports/wrap-page';

const ThreeActiveNoSSR = dynamic(
    () => import('../imports/components/ThreeActive'),
    { ssr: false }
  )

const Content = () => {
    return <ThreeActiveNoSSR />;
};

export default wrapPage(Content);
