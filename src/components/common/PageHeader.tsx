import { FC, ReactNode } from 'react'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  subtitle: string
  extra?: ReactNode
  showDivider?: boolean
}

const PageHeader: FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  extra,
  showDivider = true 
}) => {
  return (
    <header className={`page-header ${showDivider ? 'page-header-divider' : ''}`}>
      <div className="page-header-content">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </header>
  )
}

export default PageHeader