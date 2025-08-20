import { UseFormRegister, FieldValues } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  name: keyof T;
  register: UseFormRegister<T>;
  displayLabel: string;
  onChange: () => void;
}

const Checkbox = <T extends FieldValues>({
  name,
  register,
  displayLabel,
  onChange,
}: CheckboxProps<T>) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="relative size-[1em]">
        <input
          className="opacity-0 absolute z-10 appearance-none size-full peer"
          type="checkbox"
          id={name as string}
          {...register(name as any, { onChange: () => onChange() })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        />
        <div
          className="absolute w-full h-full
                        flex items-center justify-center
                        transition-all duration-150 ease-out
                        box-border border-2 border-[#EAE3D6] 
                        peer-checked:border-[#F0D1B0] peer-checked:bg-[#F0D1B0]
                        peer-checked:peer-hover:bg-transparent
                        peer-focus:ring-3 peer-focus:ring-brand-focus/50 peer-focus:ring-offset-[1px]

                        before:content-['']
                        before:block before:absolute
                        before:inset-[-2px] before:border-2 before:border-[#D6CBB8]
                        before:transition-all before:ease-out before:duration-150

                        peer-hover:before:transition-all peer-hover:before:will-change-transform
                        peer-hover:before:inset-[0px]

                        peer-checked:before:border-[#E2BD96]
                    "
        ></div>
        <div
          className="absolute w-full h-full

             /* First line of the 'X' */
             before:content-[''] before:absolute before:w-3/5 before:h-[2px] before:rounded-md
             before:bg-default-bg
             before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
             before:transform before:rotate-45
             before:opacity-0 before:transition-opacity before:duration-150

             /* Second line of the 'X' */
             after:content-[''] after:absolute after:w-3/5 after:h-[2px] after:rounded-md
             after:bg-default-bg
             after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 
             after:transform after:-rotate-45 
             after:opacity-0 after:transition-opacity after:duration-150

             peer-checked:before:opacity-100
             peer-checked:after:opacity-100
             "
        ></div>
      </div>
      <label htmlFor={name as string} className={""}>
        {displayLabel}
      </label>
    </div>
  );
};

export default Checkbox;
