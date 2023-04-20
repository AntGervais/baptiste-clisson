export type InputProps = {
  name: string
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: boolean
  required?: boolean
  defaultValue?: string
  size?: 'sm' | 'md' | 'lg'
  bg?: string // The background color of the input's background
  onChange?: (e?: any) => void
  onBlur?: (e?: any) => void
  error?: string
  color?: 'light' | 'dark'
}

export default function Input({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  defaultValue = '',
  size = 'md',
  onChange,
  onBlur,
  error = '',
  color = 'light',
  bg,
}: InputProps) {
  return (
    <div className="text-input">
      <div className="relative mt-2 w-full">
        <input
          type={type}
          id={name}
          placeholder={(placeholder || label) + (required ? '*' : '')}
          defaultValue={defaultValue}
          onInput={onChange}
          onBlur={onBlur}
          className={[
            'peer',
            'block',
            'w-full',
            'appearance-none',
            'rounded-sm',
            'border',
            'border-1',
            Boolean(error) ? 'border-red-400' : 'border-gray-300',
            'bg-transparent',
            'px-2.5',
            'pb-2.5',
            'pt-4',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'text-lg',
            color === 'light' ? 'text-gray-800' : 'text-gray-50',
            Boolean(error) ? 'focus:border-red-400' : 'focus:border-green-600',
            'focus:outline-none',
            'focus:ring-0',
          ].join(' ')}
        />
        <label
          htmlFor={name}
          className={[
            'absolute',
            'top-2',
            'left-1',
            'z-10',
            'origin-[0]',
            '-translate-y-5',
            'scale-75',
            'transform',
            'cursor-text',
            'select-none',
            bg ? bg : 'bg-purple-500', // The bg must be the color of the input's background
            'px-2',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'text-lg',
            Boolean(error) ? 'text-red-400' : 'text-gray-500',
            'duration-300',
            'peer-placeholder-shown:top-1/2',
            'peer-placeholder-shown:-translate-y-1/2',
            'peer-placeholder-shown:scale-100',
            'peer-focus:top-2',
            'peer-focus:-translate-y-5',
            'peer-focus:scale-75',
            'peer-focus:px-2',
            Boolean(error) ? 'focus:text-red-400' : 'peer-focus:text-green-600',
          ].join(' ')}
        >
          {label + (required ? '*' : '')}
        </label>
      </div>

      {error && (
        <div className="ml-2">
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
    </div>
  )
}