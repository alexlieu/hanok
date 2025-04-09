import DropDown from "../ui/DropDown";

type SortControls = {
    sortOptions: string[];
};

const SortControls: React.FC<SortControls> = ({sortOptions}) => ( 
    <>
        <DropDown options={sortOptions} />
    </>
)

export default SortControls;