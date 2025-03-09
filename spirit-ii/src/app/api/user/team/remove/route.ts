import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    // Get username from authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const username = authHeader.replace('Bearer ', '');
    
    // Get player ID from request body
    const { playerId, playerBudget } = await req.json();
    
    if (!playerId) {
      return NextResponse.json(
        { message: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const teams = db.collection('teams');
    const players = db.collection('players');
    
    // Get user team
    const team = await teams.findOne({ username });
    
    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }
    
    // Check if player is in the team
    if (!team.players || !team.players.some((id: string | ObjectId) => 
        id.toString() === playerId.toString())) {
      return NextResponse.json(
        { message: 'Player is not in your team' },
        { status: 400 }
      );
    }
    
    // Get player details for budget calculation
    let playerObjectId: ObjectId;
    try {
      playerObjectId = new ObjectId(playerId);
    } catch (error) {
      // Handle string ID case
      playerObjectId = playerId;
    }
    
    const player = await players.findOne({ _id: playerObjectId });
    
    // Calculate budget to return
    const playerCost = playerBudget || (player?.budget ? player.budget * 100000000 : 0);
    
    // Remove player from team and update budget
    const result = await teams.updateOne(
      { username },
      { 
        $pull: { players: playerId },
        $set: {
          budget_remaining: team.budget_remaining + playerCost,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to update team' },
        { status: 500 }
      );
    }
    
    // Get updated team
    const updatedTeam = await teams.findOne({ username });
    
    return NextResponse.json({
      message: 'Player removed from team successfully',
      player: {
        id: playerId,
        name: player?.name || 'Unknown Player',
      },
      budget_remaining: updatedTeam?.budget_remaining
    });
  } catch (error) {
    console.error('Error removing player from team:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
