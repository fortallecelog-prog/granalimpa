import type { SVGProps } from 'react'

const defaults: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

type IconProps = SVGProps<SVGSVGElement>

export const SunIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

export const MoonIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export const SparklesIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
    <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
  </svg>
)

export const WalletIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path d="M21 12a2 2 0 0 0-2-2h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2z" />
  </svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
)

export const TrashIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const AlertIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)

export const SendIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

export const HistoryIcon = (p: IconProps) => (
  <svg {...defaults} {...p}>
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
)
