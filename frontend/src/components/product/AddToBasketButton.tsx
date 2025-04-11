type AddToBasketButtonProps = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
};

const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({onClick}) => ( 
    <button
        type='button'
        className={`text-2xl font-medium px-4 py-2 border-black border-1 transition-colors hover:text-white hover:bg-black`}
        onClick={onClick}
    >
        add to basket
    </button>
);

export default AddToBasketButton;