import React from 'react';

function RadioInput({ name, options, selectedValue, onChange }) {
    return (
        <div className="radio">
            {options.map((option) => (
                <label key={option.value} style={{ marginRight: '15px', cursor: 'pointer', display: 'flex' }}>
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={onChange}
                        style={{ marginRight: '5px' }}
                    />
                    <span>{option.label}</span>
                </label>
            ))}
        </div>
    );
}

export default RadioInput;