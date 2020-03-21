import React from "react"
import { Form, Label, Select } from "semantic-ui-react"

export default function SelectInput(
  { 
    input, 
    multiple, 
    options,  
    placeholder, 
    meta: { touched, error } 
  }
) {
  return (
    <Form.Field error={touched && !!error}>
      <Select 
        value={input.value || null}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder}
        options={options}
        multiple={multiple}
      />
      {touched && error && <Label basic color="red">{error}</Label>}
    </Form.Field>
  )
}
