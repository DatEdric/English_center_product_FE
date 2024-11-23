import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

export default function FormComponent({
    initialData,
    optionsData,
    optionSelect,
    fieldName,
    label,
    readOnly,
    handleChange,
}) {
    const [formData, setFormData] = useState(initialData);
    const [editingField, setEditingField] = useState(null);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleSelectChange = (index, selectedOption) => {
        if (readOnly) return;

        const updatedField = Array.isArray(formData[fieldName])
            ? [...formData[fieldName]]
            : [...(formData[fieldName] || [])];

        updatedField[index] = selectedOption || null;

        const updatedFormData = { ...formData, [fieldName]: updatedField };
        setFormData(updatedFormData);

        handleChange(fieldName, updatedField);
        setEditingField(null);
    };

    const handleInputClick = (index) => {
        if (!readOnly) setEditingField(index);
    };

    return (
        <Form>
            {Array.isArray(formData[fieldName]) ? (
                formData[fieldName].map((item, index) => (
                    <Form.Group
                        controlId={`${fieldName}_${index}`}
                        key={`${fieldName}_${index}`}
                    >
                        <Form.Label>
                            {label} {index + 1}:
                        </Form.Label>
                        {editingField === index && !readOnly ? (
                            <Select
                                options={optionsData.map((option) => ({
                                    value: option,
                                    label: option[optionSelect],
                                }))}
                                onChange={(selectedOption) =>
                                    handleSelectChange(index, selectedOption.value)
                                }
                                isClearable
                                defaultValue={
                                    optionsData.find(
                                        (opt) =>
                                            opt.id === item?.id
                                    ) || null
                                }
                            />
                        ) : (
                            <Form.Control
                                type="text"
                                value={item?.[optionSelect] || ''}
                                readOnly={readOnly}
                                onClick={() => handleInputClick(index)}
                            />
                        )}
                    </Form.Group>
                ))
            ) : (
                formData[fieldName] && (
                    <Form.Group controlId={fieldName}>
                        <Form.Label>{label}:</Form.Label>
                        {editingField === fieldName && !readOnly ? (
                            <Select
                                options={optionsData.map((option) => ({
                                    value: option,
                                    label: option[optionSelect],
                                }))}
                                onChange={(selectedOption) =>
                                    handleChange(fieldName, selectedOption?.value)
                                }
                                isClearable
                                defaultValue={
                                    optionsData.find(
                                        (opt) => opt.id === formData[fieldName]?.id
                                    ) || null
                                }
                            />
                        ) : (
                            <Form.Control
                                type="text"
                                value={typeof formData[fieldName] === 'object'
                                    ? formData[fieldName][optionSelect] ||
                                      ''
                                    : formData[fieldName] || ''}
                                readOnly={readOnly}
                                onClick={() =>
                                    !readOnly && setEditingField(fieldName)
                                }
                            />
                        )}
                    </Form.Group>
                )
            )}
        </Form>
    );
}
