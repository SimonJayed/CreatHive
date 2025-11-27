import React from 'react';

function EditableText({
    isEditing,
    value,
    onChange,
    placeholder,
    tag: Tag = 'span',
    className = '',
    inputClassName = '',
    type = 'text'
}) {
    if (isEditing) {
        return (
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName}
            />
        );
    }

    return (
        <Tag className={className}>
            {value || placeholder}
        </Tag>
    );
}

export default EditableText;
