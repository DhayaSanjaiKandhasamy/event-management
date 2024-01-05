const NormalButton = ({ title, ...rest }) => {
  return (
    <button
      className="  text-white cursor-pointer p-2.5 rounded-[3px]  border-2 border-[#d11243] my-4"
      {...rest}
    >
      <div className="w-full inline-block align-middle">
        <p className="text-center font-bold text-[15px] text-[#d11243]">
          {title}
        </p>
      </div>
    </button>
  );
};
export default NormalButton;
