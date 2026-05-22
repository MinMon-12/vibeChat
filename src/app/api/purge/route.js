import { NextResponse } from 'next/server';
import {cookies} from 'next/headers'
import jwt from 'jsonwebtoken';
import db_connect from "@/database/db-connection";
import { my_conversation} from "@/database/models"; 

export async function DELETE(req){
    // Get token from cookies
    const token = cookies().get('token')?.value; 
    if(!token){ 
        return NextResponse.json({error:'Missing token'},{status:401}); 
    }
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    // Verify token
    let decoded;
    try {
        // Ensure JWT secret exists
        const secret = process.env.JWT_SECRET;
        
        if (!secret) {
        return NextResponse.json(
            { error: 'Server misconfiguration: JWT_SECRET missing' },
            { status: 500 }
        );
        }
        decoded = jwt.verify(token, secret); // Validates JWT signature
        // return NextResponse.json(
        //   { user: { id: decoded.id, role: decoded.role } },
        //   { status: 200 }
        // );
        // Connects to MongoDB after token pass
        await db_connect();
        // Find the user's conversation first
        const conversation = await my_conversation.findOne({ user_id: decoded.id });
        if (!conversation) {
        return NextResponse.json({ success: false, deletedCount: 0 });
        }

        // Count how many messages are currently in the array
        const messagesCount = conversation.messagesArray.length;

        // Empty the array
        await my_conversation.updateOne(
        { user_id: decoded.id },
        { $set: { messagesArray: [] } }
        );

        return NextResponse.json({
        success: true,
        deletedCount: messagesCount
        });

    } catch (err) {
        console.error('Error purging messagesArray:', err);
        return NextResponse.json({ success: false, error: 'Internal Server Error' });
    }
}