import type { Config } from 'prettier'

export const config = {
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always'
} satisfies Config

export default config
