import React from 'react';
import { useParams } from 'react-router-dom';

const DetailProduct = () => {
   const { productId, slug } = useParams();
   console.log(productId, slug);
   return (
      <div>
         Detail
      </div>
   );
};

export default DetailProduct;