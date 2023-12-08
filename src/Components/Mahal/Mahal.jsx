import React from 'react';
import { Link, useParams } from "react-router-dom";

import imgSrc from '../../Assets/mahal-1.avif';
function Product({mahalData}) {

  const params = useParams();

  console.log(params);

  return (
    <div>

      <article>
        <div className="relative w-full">
          <Link to={`/mahal/${mahalData.id}`}>

            <img src={mahalData.imageUrls[0]} alt='Fresh Meat' width="490" height="400" className='rounded-lg ' style={{ objectFit: 'cover', }} />
          </Link>
          {/* <div className={"absolute h-8 bottom-[-8px] right-[-8px] "}>

          </div> */}
        </div>
        <Link to={`/mahal/${mahalData.id}`}>

          <div className="mt-4 flex flex-col  ">
            <p className="h-10 text-lg truncate font-sans font-bold" style={{ width: '260px' }}>{mahalData.name}</p>
            <p className="opacity-80 mt-1 text-m">📌 {mahalData.city}</p>
            <p className="my-1"><span className="text-base font-medium ">Price Per Day: ₹{mahalData.pricePerDay}</span> <span className=" text-sm line-through	mx-1.5">₹{mahalData.oldPricePerDay}</span> <span className="text-green-500	 text-sm">{"20"}% off</span></p>
            <p className="text-xs text-gray-500	mt-2">{"tomorrow"} <b>{"10:30 AM"}</b></p>
          </div>
        </Link>

      </article>

    </div>
  )
}

export default Product;
