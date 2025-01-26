import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongo'
import User from '../../../../models/User' // You'll need to create this model

export async function GET() {
    try {
        await connectToDatabase()

        // Fetch users and sort by points in descending order
        const users = await User.find({})
            .select('username totalPoints')
            .sort({ totalPoints: -1 })
            .limit(100)
            .lean()

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard' },
            { status: 500 }
        )
    }
}