import type { ReactNode } from 'react'

interface GameTableProps {
  children: ReactNode
}

export function GameTable({ children }: GameTableProps) {
  return (
    <div className="game-table">
      <div className="table-felt">
        {children}
      </div>
    </div>
  )
}
