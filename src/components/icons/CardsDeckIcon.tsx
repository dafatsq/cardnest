import React from "react"

export interface CardsDeckIconProps extends React.SVGProps<SVGSVGElement> {
  plus?: boolean
}

const DECK_PATH =
  "M 2.32 5.34 L 2.1 5.64 L 2.0 5.96 L 2.0 15.39 L 2.07 15.66 L 2.2 15.88 L 2.42 16.1 L 2.57 16.2 L 2.74 16.28 L 2.93 16.32 L 8.39 16.32 L 9.15 16.47 L 9.64 16.59 L 9.89 16.62 L 10.26 16.72 L 10.48 16.74 L 12.54 17.72 L 14.38 19.27 L 14.63 19.4 L 14.95 19.47 L 15.22 19.44 L 15.39 19.4 L 15.64 19.27 L 15.86 19.08 L 15.86 19.05 L 16.4 18.44 L 17.01 17.68 L 17.58 17.04 L 17.8 16.74 L 19.37 14.9 L 19.47 14.75 L 19.64 14.58 L 19.74 14.43 L 21.8 12.0 L 21.95 11.68 L 21.98 11.56 L 21.98 11.21 L 21.93 11.02 L 21.78 10.75 L 21.51 10.48 L 20.57 9.69 L 20.28 9.47 L 19.35 8.66 L 18.27 7.77 L 17.8 7.36 L 17.65 7.26 L 17.33 6.96 L 17.04 6.74 L 16.74 6.47 L 16.52 6.35 L 16.37 6.3 L 16.1 6.25 L 15.88 6.28 L 15.64 6.35 L 15.49 6.42 L 15.34 6.55 L 14.51 6.13 L 13.94 5.88 L 13.33 5.56 L 12.81 5.34 L 12.15 5.0 L 11.95 4.92 L 11.73 4.87 L 11.48 4.87 L 11.21 4.95 L 11.02 5.05 L 10.72 5.29 L 10.48 5.22 L 10.11 5.17 L 6.86 4.51 L 6.59 4.51 L 6.32 4.58 L 6.05 4.73 L 5.78 5.02 L 3.01 5.02 L 2.71 5.1 L 2.47 5.22 Z M 16.1 7.31 L 19.0 9.76 L 19.15 9.86 L 19.79 10.43 L 20.7 11.16 L 20.92 11.41 L 18.73 13.99 L 18.63 14.14 L 17.82 15.07 L 17.33 15.69 L 17.04 16.0 L 16.94 16.15 L 16.0 17.23 L 15.78 17.53 L 15.61 17.7 L 15.39 18.0 L 15.12 18.29 L 15.12 18.31 L 15.0 18.41 L 11.39 15.39 L 11.21 15.22 L 10.3 14.48 L 10.18 14.36 L 10.18 14.31 L 10.72 13.65 L 11.78 12.42 L 11.88 12.27 L 12.17 11.95 L 12.27 11.8 L 12.57 11.48 L 12.66 11.34 L 12.84 11.16 L 13.18 10.72 L 15.42 8.09 L 15.51 7.95 L 15.81 7.63 L 16.03 7.33 Z M 3.08 6.08 L 5.51 6.13 L 3.87 14.29 L 3.87 14.78 L 3.89 14.87 L 3.99 15.1 L 4.14 15.27 L 3.11 15.29 L 3.06 15.24 Z M 11.68 5.93 L 12.66 6.42 L 13.23 6.67 L 13.84 6.99 L 14.26 7.18 L 14.31 7.18 L 14.6 7.33 L 14.63 7.38 L 14.48 7.53 L 13.6 8.61 L 12.27 10.16 L 12.05 10.45 L 9.3 13.7 L 9.2 13.87 L 9.13 14.09 L 9.13 14.58 L 9.3 15.02 L 7.7 14.26 L 7.65 14.21 L 7.65 14.16 L 8.68 12.0 L 9.27 10.82 L 9.49 10.3 L 9.81 9.69 L 10.03 9.17 L 10.35 8.56 L 10.6 8.0 L 10.92 7.38 L 11.14 6.86 L 11.46 6.25 L 11.46 6.2 L 11.58 5.96 Z M 6.77 5.54 L 8.76 5.93 L 9.13 6.03 L 9.49 6.08 L 9.62 6.13 L 9.74 6.13 L 10.11 6.23 L 10.21 6.23 L 10.26 6.28 L 6.62 13.87 L 6.59 13.99 L 6.59 14.41 L 6.64 14.58 L 6.74 14.78 L 6.89 14.95 L 6.82 14.97 L 6.79 14.95 L 6.69 14.95 L 6.67 14.92 L 6.45 14.9 L 6.42 14.87 L 5.19 14.65 L 5.07 14.6 L 4.97 14.6 L 4.92 14.56 L 4.92 14.46 L 5.05 13.82 L 5.12 13.57 L 5.12 13.45 L 5.19 13.2 L 5.27 12.71 L 5.39 12.22 L 6.15 8.27 L 6.28 7.77 L 6.35 7.28 L 6.42 7.04 L 6.52 6.42 L 6.67 5.81 L 6.67 5.69 L 6.69 5.59 Z"

export function CardsDeckIcon({
  className = "w-7 h-7",
  plus = false,
  viewBox,
  ...props
}: CardsDeckIconProps) {
  // Tight viewBox removes letterboxing so the cards fill the bounds generously
  const resolvedViewBox =
    viewBox || (plus ? "1.5 4.0 22.5 18.5" : "1.8 4.3 20.4 15.4")

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={resolvedViewBox}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={DECK_PATH} fill="currentColor" fillRule="evenodd" />

      {plus && (
        <g>
          {/* Backdrop mask ring */}
          <circle cx="19" cy="18.5" r="4.2" className="fill-white dark:fill-slate-900" />
          {/* Plus button circle */}
          <circle cx="19" cy="18.5" r="3.5" fill="currentColor" />
          {/* Plus symbol cross */}
          <path
            d="M 19 16.5 L 19 20.5 M 17 18.5 L 21 18.5"
            className="stroke-white dark:stroke-slate-950"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  )
}

export function CardsDeckPlusIcon(props: Omit<CardsDeckIconProps, "plus">) {
  return <CardsDeckIcon {...props} plus />
}
