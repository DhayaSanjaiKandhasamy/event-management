

const Button = ({title,...rest}) =>{
    return (
        <button className='w-6/12 bg-[#d11243] text-white cursor-pointer p-2.5 rounded-[3px] border-[none] my-4' {...rest}>

            <div className='w-full inline-block align-middle'>

                <p className='text-center font-bold text-[15px]'>
                    {title}
                </p>
            </div>
    </button>
    )
}


export default Button