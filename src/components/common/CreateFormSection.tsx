import { FC, FormEvent, ReactNode } from 'react'
import Card from './Card'
import Button from './Button'
import './CreateFormSection.css'

interface CreateFormSectionProps {
  title: string
  children: ReactNode
  onSubmit: (e: FormEvent) => void
  submitLabel?: string
  submitDisabled?: boolean
}

const CreateFormSection: FC<CreateFormSectionProps> = ({ 
  title, 
  children, 
  onSubmit,
  submitLabel = 'Create',
  submitDisabled = false
}) => {
  return (
    <Card variant="form" className="create-form-section" hover={false}>
      <h2 className="create-form-title">{title}</h2>
      <form onSubmit={onSubmit} className="create-form">
        {children}
        <div className="create-form-submit">
          <Button 
            type="submit" 
            variant="primary"
            disabled={submitDisabled}
          >
            + {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default CreateFormSection