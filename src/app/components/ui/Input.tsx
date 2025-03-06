import React from 'react'

interface InputProps {
    onClick: () => void
    onChange: () => void
    onBlur: () => void
    onFocus: () => void
    onInput: () => void
    onInvalid: () => void
    onReset: () => void
    onSearch: () => void
    icon: string


}

const Input = (props: InputProps) => {
    return (
        <input {...props} />
    )
}

export default Input