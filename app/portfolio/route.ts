import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const portfolios = await prisma.portfolio.findMany({
    include: { stocks: true }
  })
  return NextResponse.json(portfolios)
}
