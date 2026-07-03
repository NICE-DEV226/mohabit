import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-grey-dark rounded-xl overflow-hidden ${
          hover ? 'hover:bg-grey-mid hover:-translate-y-0.5 transition-all duration-200' : ''
        } ${className ?? ''}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
