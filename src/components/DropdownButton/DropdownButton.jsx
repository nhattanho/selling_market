import React, {useState} from 'react';

const DropdownButton = ({value, options, onChange, name}) => {
    // const [newValue, setValue] = useState(value);
    // const handleChange = (e) => {
    //     console.log(e.target.name);
    //     console.log(e.target.value);
    //     setValue(e.target.value); 
    // };
    return (
        <select name={name} placeholder={value.toLowerCase()} onChange={onChange}>
            {options.map((option) => (
                <option key={option.id} value={option.value}>{option.label}</option>
            ))}
        </select>
      );
};

const DropdownButtonForUpdateUser = 
    ({value, options, name, onChange}) => {

        const handleChange = (e) => {
            onChange(e);
        };
        return (
            <select name={name} value={value.toLowerCase()} onChange={handleChange}>
                {options.map((opt) => (
                    opt.value === value.toLowerCase()?
                        (
                            <option 
                                key={opt.id} 
                                value={opt.value}
                                selected="selected"
                            >
                                {opt.label}
                            </option>
                        ):
                        (
                            <option 
                                key={opt.id} 
                                value={opt.value}
                            >
                                {opt.label}
                            </option>
                        )
                ))}
            </select>
        );
    };

export {DropdownButton, DropdownButtonForUpdateUser};