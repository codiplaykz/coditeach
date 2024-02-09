import {Combobox, TextInput, useCombobox} from '@mantine/core';
import {useTranslation} from "react-i18next";

interface CustomSelectProps {
    label: string,
    placeholder: string,
    value: string,
    setValue: (value: string) => void,
    options: string[]
}

export default function CustomSelect({label, placeholder, value, setValue, options}: CustomSelectProps) {
    const combobox = useCombobox();
    const shouldFilterOptions = !options.some((item) => item === value);
    const filteredOptions = shouldFilterOptions
        ? options.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
        : options;
    const {t} = useTranslation()

    const selectOptions = filteredOptions.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));

    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                setValue(optionValue);
                combobox.closeDropdown();
            }}
            store={combobox}
        >
            <Combobox.Target>
                <TextInput
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {selectOptions.length === 0 ? <Combobox.Empty>{t('customSelect.nothingFound')}</Combobox.Empty> : selectOptions}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}