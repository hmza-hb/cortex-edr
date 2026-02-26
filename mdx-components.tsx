import type { MDXComponents } from 'nextra/mdx-components'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components
    }
}
