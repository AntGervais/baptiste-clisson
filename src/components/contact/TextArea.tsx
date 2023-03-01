export type TextAreaProps = {
  name: string
  label: string
  height?: string
  placeholder?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (e?: any) => void
  onBlur?: (e?: any) => void
  error?: string
  bg?: string
}

export default function TextArea({
  name,
  label,
  height,
  placeholder,
  required = false,
  size = 'md',
  onChange,
  onBlur,
  error = '',
  bg,
}: TextAreaProps) {
  return (
    <div className="textarea-input">
      <div className="relative mt-2 w-full">
        <textarea
          name={name}
          id={name}
          onInput={onChange}
          onBlur={onBlur}
          placeholder={(placeholder || label) + (required ? '*' : '')}
          className={[
            height ? height : 'h-24',
            'peer',
            'block',
            'w-full',
            'appearance-none',
            'rounded-lg',
            'border',
            'border-1',
            Boolean(error) ? 'border-red-500' : 'border-gray-300',
            'bg-transparent',
            'px-2.5',
            'pb-2.5',
            'pt-4',
            'text-gray-900',
            Boolean(error) ? 'focus:border-red-500' : 'focus:border-green-600',
            'focus:outline-none',
            'focus:ring-0',
          ].join(' ')}
        ></textarea>
        <label
          htmlFor={name}
          className={[
            'absolute',
            'top-2',
            'left-1',
            'z-10',
            'origin-[0]',
            '-translate-y-4',
            'scale-75',
            'transform',
            'cursor-text',
            'select-none',
            bg ? bg : 'bg-white',
            'px-2',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'text-lg',
            Boolean(error) ? 'text-red-500' : 'text-gray-500',
            'duration-300',
            'peer-placeholder-shown:top-6',
            'peer-placeholder-shown:-translate-y-1/2',
            'peer-placeholder-shown:scale-100',
            'peer-focus:top-2',
            'peer-focus:-translate-y-4',
            'peer-focus:scale-75',
            'peer-focus:px-2',
            Boolean(error) ? 'focus:text-red-500' : 'peer-focus:text-green-600',
          ].join(' ')}
        >
          {label + (required ? '*' : '')}
        </label>
      </div>

      {error && (
        <div className="ml-2">
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}
    </div>
  )
}