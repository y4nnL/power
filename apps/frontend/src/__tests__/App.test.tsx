import React from 'react'
import { render, screen } from '@testing-library/react'

import App from '../App'

describe('App', () => {
  it('renders the home page content', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /bonjour power/i
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Une base React + Vite toute simple.')
    ).toBeInTheDocument()
  })
})
