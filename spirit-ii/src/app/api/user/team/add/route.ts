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
    
    // Check if player is already in the team
    if (team.players && team.players.some((id: string | ObjectId) => 
        id.toString() === playerId.toString())) {
      return NextResponse.json(
        { message: 'Player is already in your team' },
        { status: 400 }
      );
    }
    
    // Check if team is already full (max 11 players)
    if (team.players && team.players.length >= 11) {
      return NextResponse.json(
        { message: 'Team is already full (maximum 11 players)' },
        { status: 400 }
      );
    }
    
    // Verify player exists
    let playerObjectId: ObjectId;
    try {
      playerObjectId = new ObjectId(playerId);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid player ID format' },
        { status: 400 }
      );
    }
    
    const player = await players.findOne({ _id: playerObjectId });
    
    if (!player) {
      return NextResponse.json(
        { message: 'Player not found' },
        { status: 404 }
      );
    }
    
    // Check budget
    const playerCost = playerBudget || (player.budget ? player.budget * 100000000 : 0);
    
    if (playerCost > team.budget_remaining) {
      return NextResponse.json(
        { message: 'Insufficient budget to add this player' },
        { status: 400 }
      );
    }
    
    // Add player to team and update budget
    const result = await teams.updateOne(
      { username },
      { 
        $push: { players: playerObjectId },
        $set: {
          budget_remaining: team.budget_remaining - playerCost,
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
      message: 'Player added to team successfully',
      player: {
        id: player._id.toString(),
        name: player.name,
        role: player.role
      },
      budget_remaining: updatedTeam?.budget_remaining
    });
  } catch (error) {
    console.error('Error adding player to team:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
