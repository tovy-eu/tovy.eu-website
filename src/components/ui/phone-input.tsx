"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";
import PhoneInputPrimitive, {
  type Country,
  type PhoneInputProps as PhoneInputPrimitiveProps,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, type InputProps } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof PhoneInputPrimitive>,
  "onChange"
> & {
  onChange: (value: PhoneInputPrimitiveProps["value"]) => void;
};

const PhoneInput = ({
  className,
  onChange,
  ...props
}: PhoneInputProps) => {
  return (
    <PhoneInputPrimitive
      className={cn("flex", className)}
      onChange={onChange}
      {...props}
      inputComponent={InputComponent}
      countrySelectComponent={CountrySelect}
    />
  );
};

const InputComponent = ({ ...props }: InputProps) => {
  return <Input {...props} />;
};
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  onChange: (value: Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (country: Country) => {
    onChange(country);
  };

  const optionList = useMemo(() => {
    return options
      .filter((option) => option.value)
      .map((option) => (
        <CommandItem
          className="gap-2"
          key={option.value}
          onSelect={() => handleSelect(option.value)}
        >
          <FlagComponent country={option.value} countryName={option.label} />
          <span>{option.label}</span>
          <span className="text-sm text-muted-foreground">
            +{getCountryCallingCode(option.value)}
          </span>
          <Check
            className={cn("ml-auto h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")}
          />
        </CommandItem>
      ));
  }, [options, value, handleSelect]);


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("flex gap-2 rounded-e-none rounded-s-lg pl-3 pr-1")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn("-mr-2 h-4 w-4", disabled ? "hidden" : "")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-64">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>{optionList}</CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
CountrySelect.displayName = "CountrySelect";

const FlagComponent = ({ country, countryName }: { country: Country; countryName: string }) => {
  const Flag = useMemo(() => {
    try {
      return require(`react-phone-number-input/flags/${country}.svg`).default;
    } catch (error) {
      console.error(`Flag for country "${country}" not found`);
      return () => null;
    }
  }, [country]);

  return <Flag title={countryName} className="h-5 w-5 rounded-sm" />;
};
FlagComponent.displayName = "FlagComponent";

// Assuming you have a way to get country calling code
// This is a placeholder. You might need a library like `libphonenumber-js`
// to get this information accurately.
const getCountryCallingCode = (country: Country) => {
  try {
    const metadata = require('libphonenumber-js/metadata.min.json');
    const countryData = metadata.countries[country];
    return countryData ? countryData[0] : '';
  } catch (error) {
    return '';
  }
}

export { PhoneInput };
