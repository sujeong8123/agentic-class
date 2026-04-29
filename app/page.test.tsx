import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from './page'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    'aria-label': ariaLabel,
  }: {
    href: string
    children: React.ReactNode
    'aria-label'?: string
  }) => <a href={href} aria-label={ariaLabel}>{children}</a>,
}))

describe('HomePage', () => {
  it('shows three level cards', () => {
    render(<HomePage />)
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('Beginner card links to /beginner', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: 'Beginner' })).toHaveAttribute('href', '/beginner')
  })

  it('Intermediate card links to /intermediate', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: 'Intermediate' })).toHaveAttribute('href', '/intermediate')
  })

  it('Advanced card links to /advanced', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: 'Advanced' })).toHaveAttribute('href', '/advanced')
  })
})
