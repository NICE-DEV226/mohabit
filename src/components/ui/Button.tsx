import { ButtonHTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  className?: string
  children: React.ReactNode
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string
  external?: boolean
  onClick?: () => void
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variants: Record<Variant, string> = {
  primary: 'bg-gold hover:bg-gold-600 text-black font-semibold',
  secondary: 'bg-blue-500 hover:bg-blue-600 text-white font-semibold',
  outline: 'border-2 border-white/20 hover:border-white/50 text-white font-semibold',
  ghost: 'text-grey-text hover:text-white hover:bg-white/5',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

function baseClasses(variant: Variant, size: Size, extra?: string) {
  return `inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${variants[variant]} ${sizes[size]} ${extra ?? ''}`
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    if ('href' in props && props.href) {
      const { href, external, variant = 'primary', size = 'md', loading, className, children, ...rest } = props

      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${baseClasses(variant, size, className)} disabled:opacity-50 disabled:cursor-not-allowed`}
            {...rest}
          >
            {loading && <Spinner />}
            {children}
          </a>
        )
      }

      return (
        <Link
          href={href}
          className={`${baseClasses(variant, size, className)}`}
          {...rest}
        >
          {loading && <Spinner />}
          {children}
        </Link>
      )
    }

    const { variant = 'primary', size = 'md', loading, className, children, disabled, ...rest } = props as ButtonAsButton

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseClasses(variant, size, className)} disabled:opacity-50 disabled:cursor-not-allowed`}
        {...rest}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default Button
