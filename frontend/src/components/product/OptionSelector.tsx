type OptionSelectorProps = {
    type: 'size' | 'flavour';
    options: string[];
    selected: string | null
    onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
};


const OptionSelector: React.FC<OptionSelectorProps> = ({type, options, selected, onSelect}) => (
    <>
        <h4 className={`text-xl font-medium`}>
            {type}
        </h4>
        {options.map(option => (
            <button
                type='button'
                key={`${type}-${option}`}
                className={`text-2xl px-4 py-2 transition-all font-medium
                    ${
                        selected === option
                            ? 'text-black'
                            : 'hover:text-black text-gray-400'
                    }
                `}
                onClick={onSelect}
                {...{
                    [`data-${type}`]: option
                }}
            >
                    {option.toLowerCase()}
            </button>
        ))}
    </>
);

export default OptionSelector;